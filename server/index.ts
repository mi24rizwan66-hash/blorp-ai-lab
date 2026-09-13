import {randomBytes} from 'node:crypto';
import {getConfig} from './config.js';
import {createApp} from './app.js';
const config=getConfig();
if(config.production){if(config.sessionSecret.length<32)throw new Error('SESSION_SECRET must contain at least 32 random characters.');if(!config.appOrigin.startsWith('https://'))throw new Error('APP_ORIGIN must be an HTTPS origin in production.');}
else if(!config.sessionSecret)config.sessionSecret=randomBytes(48).toString('hex');
const {app,db}=createApp(config);const server=app.listen(config.port,'0.0.0.0',()=>console.log(`BLORP API listening on port ${config.port}. AI ${config.aiApiKey?'configured':'DEMO MODE'}.`));
const housekeeping=setInterval(()=>{const now=Date.now();db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now);db.prepare('DELETE FROM challenges WHERE expires_at<?').run(now-86400000);db.prepare('DELETE FROM rate_limits WHERE reset_at<?').run(now-86400000);db.prepare("UPDATE usage SET status='failed' WHERE status='reserved' AND created_at<?").run(now-300000);},60000);housekeeping.unref();
function shutdown(){clearInterval(housekeeping);server.close(()=>{db.close();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();}process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
