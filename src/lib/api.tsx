import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
export type User={id:string;name:string;email:string;verified:boolean;settings:Record<string,any>;membership:{planId:string;activatedAt:number|null;expiresAt:number|null;status:string};remaining:number};
export type Config={demo:boolean;google:boolean;email:boolean;payments:boolean;admin:boolean;lifetimeOpen:boolean;models:string[];now:number};
export async function api<T=any>(path:string,options:RequestInit={}):Promise<T>{
  const response=await fetch('/api'+path,{credentials:'same-origin',...options,headers:{...(!(options.body instanceof FormData)?{'Content-Type':'application/json'}:{}),...options.headers}});
  const data=await response.json().catch(()=>({error:'The server did not return a valid response.'}));
  if(!response.ok)throw new Error(data.error||'Something went wrong. Please try again.');return data;
}
export const post=<T=any,>(path:string,data?:unknown)=>api<T>(path,{method:'POST',body:JSON.stringify(data??{})});
type AppState={user:User|null;config:Config;loading:boolean;connectionError:string;refresh:()=>Promise<void>;notify:(message:string)=>void};
const Context=createContext<AppState>(null!);
export function AppProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(null),[config,setConfig]=useState<Config>({demo:true,google:false,email:false,payments:false,admin:false,lifetimeOpen:false,models:[],now:Date.now()}),[loading,setLoading]=useState(true),[connectionError,setConnectionError]=useState(''),[toast,setToast]=useState('');
  async function refresh(){try{const [c,s]=await Promise.all([api<Config>('/config'),api<{user:User|null}>('/session')]);setConfig(c);setUser(s.user);setConnectionError('');}catch(e){setConnectionError((e as Error).message);}finally{setLoading(false);}}
  useEffect(()=>{void refresh();},[]);
  useEffect(()=>{document.documentElement.dataset.compact=String(!!user?.settings.compact);document.documentElement.dataset.reduceMotion=String(!!user?.settings.reduceMotion);},[user?.settings]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(id);},[toast]);
  return <Context.Provider value={{user,config,loading,connectionError,refresh,notify:setToast}}>{children}{toast&&<div className="toast" role="status">{toast}<button aria-label="Dismiss notification" onClick={()=>setToast('')}>×</button></div>}</Context.Provider>;
}
export const useApp=()=>useContext(Context);
export function useResource<T=any>(path:string,enabled=true){const [data,setData]=useState<T|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(enabled);async function reload(){if(!enabled){setLoading(false);return;}setLoading(true);try{setData(await api<T>(path));setError('');}catch(e){setError((e as Error).message);}finally{setLoading(false);}}useEffect(()=>{void reload();},[path,enabled]);return{data,error,loading,reload};}
export const currency=(n:number)=>'₹'+n.toLocaleString('en-IN');
export const date=(n:number|string|null|undefined)=>n?new Date(n).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}):'—';
export const shortDate=(n:number|string|null|undefined)=>n?new Date(n).toLocaleDateString('en-IN',{dateStyle:'medium'}):'No expiration';
export async function copy(text:string,notify:(s:string)=>void){try{await navigator.clipboard.writeText(text);notify('Copied to clipboard');}catch{notify('Clipboard unavailable. Select and copy the text.');}}
