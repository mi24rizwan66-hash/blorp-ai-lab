import React from 'react';
import {Routes,Route} from 'react-router-dom';
import {AppProvider} from './lib/api';
import {Layout,Workspace} from './components/Layout';
import Home from './pages/Home';
import Lab,{Playground} from './pages/Lab';
import {Pricing,Payment} from './pages/Pricing';
import Auth from './pages/Auth';
import {Dashboard,History,Projects,PromptLibrary,Files,Account} from './pages/WorkspacePages';
import {Models,Experiments,Developers,StatusPage,Updates,About,NotFound} from './pages/PublicPages';
import Admin from './pages/Admin';
export default function App(){return <AppProvider><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route element={<Workspace/>}><Route path="lab" element={<Lab/>}/><Route path="dashboard" element={<Dashboard/>}/><Route path="playground" element={<Playground/>}/><Route path="projects" element={<Projects/>}/><Route path="projects/:id" element={<Projects/>}/><Route path="prompts" element={<PromptLibrary/>}/><Route path="history" element={<History/>}/><Route path="files" element={<Files/>}/><Route path="account" element={<Account/>}/></Route><Route path="models" element={<Models/>}/><Route path="experiments" element={<Experiments/>}/><Route path="pricing" element={<Pricing/>}/><Route path="payment" element={<Payment/>}/><Route path="developers" element={<Developers/>}/><Route path="status" element={<StatusPage/>}/><Route path="updates" element={<Updates/>}/><Route path="about" element={<About/>}/>{['login','register','verify-email','forgot-password','reset-password'].map(p=><Route key={p} path={p} element={<Auth/>}/>)}<Route path="admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></AppProvider>;}
