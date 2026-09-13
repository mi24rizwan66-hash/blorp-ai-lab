import type {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,ArrowRight,Box,Zap,Brain,Code2,Eye,Search,Sparkles,Orbit,Lock,Loader2} from 'lucide-react';
export const icons={zap:Zap,box:Box,brain:Brain,code:Code2,eye:Eye,search:Search,sparkles:Sparkles,orbit:Orbit};
export function Brand(){return <Link to="/" className="brand" aria-label="BLORP home"><svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true"><path d="M2 2h13l9 7-6 5 6 5-9 7H2zm6 5v5h6l4-3-4-2zm0 10v5h6l4-3-4-2z" fill="currentColor"/></svg>BLORP<span>_</span></Link>;}
export function Tag({children,tone=''}:{children:ReactNode;tone?:string}){return <span className={'tag '+tone}>{children}</span>;}
export function PageHeading({label,title,description,action}:{label:string;title:string;description?:string;action?:ReactNode}){return <div className="page-heading"><div><div className="eyebrow">// {label}</div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div>;}
export function SectionHeading({index,title,link,to}:{index:string;title:string;link?:string;to?:string}){return <div className="section-heading"><div><span className="eyebrow">{index} /</span><h2>{title}</h2></div>{link&&to&&<Link to={to}>{link}<ArrowUpRight size={17}/></Link>}</div>;}
export function Empty({title,description,to,action}:{title:string;description:string;to?:string;action?:string}){return <div className="empty"><Box size={30}/><h3>{title}</h3><p>{description}</p>{to&&<Link className="button secondary" to={to}>{action||'Open lab'}<ArrowRight size={16}/></Link>}</div>;}
export function AccountGate({children}:{children?:ReactNode}){return <div className="account-gate"><Lock size={22}/><div><h3>Make the lab yours.</h3><p>Sign in to save your work, manage your plan and pick up where you left off.</p></div><Link className="button" to="/login">Sign in <ArrowRight size={16}/></Link>{children}</div>;}
export function Loading(){return <div className="loading" role="status"><Loader2 className="spin" size={20}/> Loading your workspace…</div>;}
export function ErrorNotice({message}:{message:string}){return message?<div className="notice error" role="alert">{message}</div>:null;}
export function Status({value}:{value:string}){return <span className={'status-pill '+value.toLowerCase()}><i/>{value.replaceAll('_',' ')}</span>;}
