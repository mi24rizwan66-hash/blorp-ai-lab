import 'dotenv/config';
import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const source=process.env.DATABASE_PATH||'data/blorp.sqlite';const dir=resolve('data/backups');mkdirSync(dir,{recursive:true});const filename=resolve(dir,'blorp-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite');const db=new DatabaseSync(source);await backup(db,filename);db.close();console.log('Database snapshot created:',filename);console.log('Also back up UPLOADS_PATH separately. Keep backups encrypted and access-controlled.');
