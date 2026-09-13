import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { PLANS } from './catalog.js';
export type Row=Record<string,any>;
export function openDatabase(path:string) {
  if(path!==':memory:')mkdirSync(dirname(resolve(path)),{recursive:true});
  const db=new DatabaseSync(path);db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  db.exec(readFileSync(resolve('server/schema.sql'),'utf8'));
  const q=db.prepare('INSERT INTO plans(id,name,price,daily_limit) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,price=excluded.price,daily_limit=excluded.daily_limit');
  for(const p of PLANS)q.run(p.id,p.name,p.price,p.limit);
  return db;
}
export function transaction<T>(db:DatabaseSync,fn:()=>T):T { db.exec('BEGIN IMMEDIATE');try {const value=fn();db.exec('COMMIT');return value;}catch(e){db.exec('ROLLBACK');throw e;} }
