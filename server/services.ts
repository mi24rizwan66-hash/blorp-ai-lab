import type {DatabaseSync} from 'node:sqlite';
import {getPlan,PLANS,addMonth,LIFETIME_DEADLINE} from './catalog.js';
import {transaction,type Row} from './db.js';
import {must,id,HttpError} from './security.js';
export function membership(db:DatabaseSync,userId:string,now=Date.now()){const m=db.prepare('SELECT * FROM memberships WHERE user_id=?').get(userId) as Row|undefined;return m&&(m.plan_id==='lifetime'||m.expires_at>now)?{planId:m.plan_id,activatedAt:m.activated_at,expiresAt:m.expires_at,status:'ACTIVE'}:{planId:'free',activatedAt:null,expiresAt:null,status:m?'EXPIRED':'ACTIVE'};}
export function quota(db:DatabaseSync,userId:string,now=Date.now()){const m=membership(db,userId,now),plan=getPlan(m.planId)!;const start=Math.floor(now/86400000)*86400000;const used=Number((db.prepare("SELECT COUNT(*) n FROM usage WHERE user_id=? AND created_at>=? AND status IN ('reserved','complete','aborted')").get(userId,start) as Row).n);return{used,remaining:Math.max(0,plan.limit-used),limit:plan.limit};}
export function userView(db:DatabaseSync,userId:string){const u=db.prepare('SELECT id,name,email,verified,settings FROM users WHERE id=?').get(userId) as Row;return{...u,verified:!!u.verified,settings:JSON.parse(u.settings),membership:membership(db,userId),remaining:quota(db,userId).remaining};}
export function notification(db:DatabaseSync,userId:string,title:string,body:string){db.prepare('INSERT INTO notifications(id,user_id,title,body,created_at) VALUES(?,?,?,?,?)').run(id(),userId,title,body,Date.now());}
export function submitPayment(db:DatabaseSync,userId:string,planId:string,utr:string,payerName:string,now=Date.now()){
 const p=getPlan(planId);must(p&&p.price>0,400,'Select a paid plan.');must(membership(db,userId,now).planId!=='lifetime',409,'Your Lifetime membership is already active.');must(planId!=='lifetime'||now<Date.parse(LIFETIME_DEADLINE),410,'The Founders Lifetime offer has closed.');
 const paymentId=id();try{db.prepare('INSERT INTO payments(id,user_id,plan_id,amount,utr,payer_name,submitted_at) VALUES(?,?,?,?,?,?,?)').run(paymentId,userId,p!.id,p!.price,utr.trim().toUpperCase(),payerName,now);}catch(e){const message=String(e);if(message.includes('payments.utr'))throw new HttpError(409,'This transaction reference has already been submitted.');if(message.includes('payments.user_id'))throw new HttpError(409,'You already have a payment awaiting verification.');throw e;}
 notification(db,userId,'Payment under verification',`${p!.name}: your payment reference has been submitted for manual review.`);return db.prepare('SELECT * FROM payments WHERE id=?').get(paymentId);
}
export function reviewPayment(db:DatabaseSync,paymentId:string,adminId:string,action:'APPROVED'|'REJECTED',note:string,now=Date.now()){
 return transaction(db,()=>{const p=db.prepare('SELECT * FROM payments WHERE id=?').get(paymentId) as Row|undefined;must(p,404,'Payment not found.');must(p!.status==='PENDING',409,'This payment has already been reviewed.');
  db.prepare("UPDATE payments SET status=?,reviewed_by=?,reviewed_at=?,review_note=? WHERE id=? AND status='PENDING'").run(action,adminId,now,note,paymentId);
  if(action==='APPROVED'){const old=db.prepare('SELECT * FROM memberships WHERE user_id=?').get(p!.user_id) as Row|undefined;const preserve=old?.plan_id==='lifetime';if(!preserve){const start=old&&old.plan_id===p!.plan_id&&old.expires_at>now?old.expires_at:now;const expires=p!.plan_id==='lifetime'?null:addMonth(start);db.prepare('INSERT INTO memberships VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET plan_id=excluded.plan_id,activated_at=excluded.activated_at,expires_at=excluded.expires_at,source_payment=excluded.source_payment').run(p!.user_id,p!.plan_id,now,expires,paymentId);}
   notification(db,p!.user_id,'Membership activated',`${getPlan(p!.plan_id)!.name} payment approved. ${preserve?'Your Lifetime access is preserved.':'Your access is now active.'}`);
  }else notification(db,p!.user_id,'Payment could not be verified',note||'Your membership is unchanged. Check the payment details and contact the lab administrator.');
  db.prepare('INSERT INTO audit_log VALUES(?,?,?,?,?,?)').run(id(),adminId,'PAYMENT_'+action,paymentId,JSON.stringify({plan:p!.plan_id,amount:p!.amount,note}),now);return db.prepare('SELECT * FROM payments WHERE id=?').get(paymentId);
 });
}
export function usageSummary(db:DatabaseSync,userId?:string){const where=userId?'user_id=? AND ':'';const params=userId?[userId]:[];const since=Date.now()-7*86400000;const rows=db.prepare(`SELECT strftime('%Y-%m-%d',created_at/1000,'unixepoch') day,COUNT(*) messages,SUM(input_tokens+output_tokens) tokens,AVG(latency_ms) latency FROM usage WHERE ${where}status='complete' AND created_at>=? GROUP BY day ORDER BY day`).all(...params,since) as Row[];
 const days=Array.from({length:7},(_,i)=>{const day=new Date(Date.now()-(6-i)*86400000).toISOString().slice(0,10);return{day,messages:0,tokens:0,latency:0,...rows.find(r=>r.day===day)};});
 const models=db.prepare(`SELECT model,COUNT(*) messages,SUM(input_tokens+output_tokens) tokens FROM usage WHERE ${where}status='complete' GROUP BY model`).all(...params);
 const total=db.prepare(`SELECT COUNT(*) messages,COALESCE(SUM(input_tokens+output_tokens),0) tokens,COALESCE(AVG(latency_ms),0) latency FROM usage WHERE ${userId?'user_id=? AND ':''}status='complete'`).get(...params);return{days,models,total};
}
