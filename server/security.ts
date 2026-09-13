import {scrypt as scryptCallback,randomBytes,randomInt,createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import type {DatabaseSync} from 'node:sqlite';
import type {Request,Response,NextFunction} from 'express';
import type {Row} from './db.js';
const scrypt=promisify(scryptCallback);
export const id=()=>randomBytes(18).toString('base64url');
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64) as Buffer;return `scrypt:${salt}:${key.toString('hex')}`;}
export async function verifyPassword(password:string,hash:string){const [kind,salt,key]=hash.split(':');if(kind!=='scrypt'||!salt||!key||key.length!==128)return false;const actual=await scrypt(password,salt,64) as Buffer;return timingSafeEqual(actual,Buffer.from(key,'hex'));}
export class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
export const must=(condition:unknown,status:number,message:string)=>{if(!condition)throw new HttpError(status,message);};
export function limit(db:DatabaseSync,key:string,max:number,windowMs:number,now=Date.now()){
 db.prepare('INSERT INTO rate_limits(key,hits,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN reset_at<=? THEN 1 ELSE hits+1 END,reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END').run(key,now+windowMs,now,now);
 const row=db.prepare('SELECT hits FROM rate_limits WHERE key=?').get(key) as Row;must(row.hits<=max,429,'Too many attempts. Please wait and try again.');
}
export function identity(db:DatabaseSync,req:Request,admin=false){const token=req.cookies?.[admin?'blorp_admin':'blorp_session'];if(typeof token!=='string')return null;return db.prepare(`SELECT * FROM sessions WHERE id_hash=? AND expires_at>? AND ${admin?'admin_id':'user_id'} IS NOT NULL`).get(digest(token),Date.now()) as Row|undefined;}
export function session(db:DatabaseSync,res:Response,subject:string,secure:boolean,admin=false,remember=false){const token=id()+id(),ttl=admin?60*60*1000:(remember?30:1)*24*60*60*1000;db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(digest(token),admin?null:subject,admin?subject:null,Date.now()+ttl,Date.now());res.cookie(admin?'blorp_admin':'blorp_session',token,{httpOnly:true,secure,sameSite:'lax',path:'/',...(remember||admin?{maxAge:ttl}:{})});}
export function guard(db:DatabaseSync,admin=false){return(req:Request,res:Response,next:NextFunction)=>{const who=identity(db,req,admin);if(!who){res.status(401).json({error:admin?'Admin verification required.':'Please sign in to continue.'});return;}res.locals.identity=who;next();};}
export function otpHash(secret:string,challengeId:string,code:string){return createHmac('sha256',secret).update(`${challengeId}:${code}`).digest('hex');}
export function createChallenge(db:DatabaseSync,secret:string,subject:string,purpose:string,now=Date.now()){
 const latest=db.prepare('SELECT created_at FROM challenges WHERE subject=? AND purpose=? ORDER BY created_at DESC LIMIT 1').get(subject,purpose) as Row|undefined;
 must(!latest||now-latest.created_at>=60000,429,'Wait 60 seconds before requesting another code.');
 db.prepare('UPDATE challenges SET consumed=1 WHERE subject=? AND purpose=?').run(subject,purpose);
 const challengeId=id(),code=String(randomInt(100000,1000000));
 db.prepare('INSERT INTO challenges(id,subject,purpose,code_hash,expires_at,created_at) VALUES(?,?,?,?,?,?)').run(challengeId,subject,purpose,otpHash(secret,challengeId,code),now+300000,now);return{challengeId,code};
}
export function consumeChallenge(db:DatabaseSync,secret:string,challengeId:string,code:string,now=Date.now()){
 const c=db.prepare('SELECT * FROM challenges WHERE id=?').get(challengeId) as Row|undefined;
 must(c&&!c.consumed&&c.expires_at>now&&c.attempts<5,400,'Code expired or unavailable. Request a new code.');
 db.prepare('UPDATE challenges SET attempts=attempts+1 WHERE id=?').run(challengeId);
 const correct=timingSafeEqual(Buffer.from(c!.code_hash),Buffer.from(otpHash(secret,challengeId,code)));
 must(correct,400,'Incorrect code. Please try again.');db.prepare('UPDATE challenges SET consumed=1 WHERE id=?').run(challengeId);return c!;
}
