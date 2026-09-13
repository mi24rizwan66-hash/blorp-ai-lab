import nodemailer from 'nodemailer';
import type {Config} from './config.js';
export type Mailer=(to:string,code:string,purpose:string)=>Promise<void>;
export function mailConfigured(c:Config){return Boolean(c.smtpHost&&c.emailFrom);}
export function makeMailer(c:Config):Mailer {const transport=nodemailer.createTransport({host:c.smtpHost,port:c.smtpPort,secure:c.smtpSecure,requireTLS:!c.smtpSecure,auth:c.smtpUser?{user:c.smtpUser,pass:c.smtpPass}:undefined,connectionTimeout:10000,socketTimeout:15000});return async(to,code,purpose)=>{await transport.sendMail({from:c.emailFrom,to,subject:`${code} — BLORP ${purpose==='admin'?'admin verification':'verification code'}`,text:`Your BLORP AI LAB verification code is ${code}.\n\nIt expires in 5 minutes and can be used once.\nIf you did not request this, you can ignore this message.\nNever share this code.`});};}
