import {stdin,stdout} from 'node:process';
import {hashPassword} from '../server/security.js';
if(!stdin.isTTY){console.error('Run this command in an interactive terminal. Do not pass a password on the command line.');process.exit(1);}
stdout.write('New admin password (12–128 characters; input hidden): ');stdin.setRawMode(true);stdin.resume();let password='';
stdin.on('data',async(data:Buffer)=>{for(const char of data.toString()){if(char==='\u0003'){stdin.setRawMode(false);process.exit(1);}if(char==='\r'||char==='\n'){stdin.setRawMode(false);stdin.pause();stdout.write('\n');if(password.length<12||password.length>128){console.error('Use 12–128 characters.');process.exit(1);}const hash=await hashPassword(password);password='';stdout.write('ADMIN_PASSWORD_HASH='+hash+'\n');process.exit(0);}else if(char==='\u007f')password=password.slice(0,-1);else if(char>=' ')password+=char;}});
