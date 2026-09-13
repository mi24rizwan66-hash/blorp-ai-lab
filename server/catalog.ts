export const UPI_ID = 'rizwan-cord-pinx@fam';
export const LIFETIME_DEADLINE = '2026-12-25T18:30:00.000Z'; // 26 Dec, 00:00 India. Sale includes 25 December.
export const MODELS = [
  {id:'fast',name:'BLORP Fast',description:'Everyday intelligence, without the wait.',category:'Everyday',icon:'zap'},
  {id:'core',name:'BLORP Core',description:'A balanced mind for ambitious work.',category:'General',icon:'box'},
  {id:'reason',name:'BLORP Reason',description:'Work through complexity. Find clarity.',category:'Reasoning',icon:'brain'},
  {id:'code',name:'BLORP Code',description:'From first function to final fix.',category:'Development',icon:'code'},
  {id:'vision',name:'BLORP Vision',description:'Make sense of images and screenshots.',category:'Multimodal',icon:'eye'},
  {id:'research',name:'BLORP Research',description:'Structure questions. Connect evidence.',category:'Research',icon:'search'},
  {id:'creative',name:'BLORP Creative',description:'Give your next idea a different dimension.',category:'Creative',icon:'sparkles'},
  {id:'max',name:'BLORP Max',description:'Our highest configured capability tier.',category:'Advanced',icon:'orbit'},
] as const;
export type ModelId = typeof MODELS[number]['id'];
export const PLANS = [
  {id:'free',name:'FREE',price:0,period:'Always free',limit:20,uploadMb:0,historyDays:7,models:['fast'],tag:'START EXPLORING',features:['20 AI messages / day','BLORP Fast','Basic chat','7-day history','Standard speed'],qr:null},
  {id:'core',name:'CORE',price:100,period:'/ month',limit:100,uploadMb:5,historyDays:90,models:['fast','core','code'],tag:'EVERYDAY INTELLIGENCE',features:['100 AI messages / day','Fast, Core & Code','File uploads · 5 MB / file','90-day history','Faster responses'],qr:'/payments/upi-100.png'},
  {id:'pro',name:'PRO',price:299,period:'/ month',limit:500,uploadMb:10,historyDays:365,models:['fast','core','reason','code','vision','research','creative'],tag:'MOST POPULAR',features:['500 AI messages / day','7 BLORP models','Vision & research','Projects & saved prompts','Priority responses'],qr:'/payments/upi-299.png'},
  {id:'lab',name:'LAB+',price:599,period:'/ month',limit:1500,uploadMb:25,historyDays:0,models:MODELS.map(m=>m.id),tag:'MAXIMUM POWER',features:['1,500 AI messages / day','Every BLORP model','BLORP Max','Files up to 25 MB','Advanced analytics','Priority experiments'],qr:'/payments/upi-599.png'},
  {id:'lifetime',name:'FOUNDERS LIFETIME',price:9996,period:'one-time',limit:1500,uploadMb:25,historyDays:0,models:MODELS.map(m=>m.id),tag:'FOUNDING CLASS · 2026',features:['Highest usage tier · 1,500 / day','All current & future BLORP models','Future premium features','Priority processing','Founders badge','No monthly renewal'],qr:'/payments/upi-9996.png'},
] as const;
export type PlanId=typeof PLANS[number]['id'];
export const getPlan=(id:string)=>PLANS.find(p=>p.id===id);
export function addMonth(timestamp:number) { const d=new Date(timestamp);const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+1);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return d.getTime(); }
export const PROMPTS=[
  {id:'p1',category:'Coding',title:'A second pair of eyes',text:'Review this code for bugs, security issues and clarity. Prioritize findings and explain each fix. Code:\n'},
  {id:'p2',category:'Study',title:'Understand, then remember',text:'Teach me this concept using a simple analogy, a worked example and three practice questions: '},
  {id:'p3',category:'Research',title:'Turn curiosity into a plan',text:'Create a research plan for this question. Separate known facts, assumptions and sources I should verify: '},
  {id:'p4',category:'Business',title:'Pressure-test an idea',text:'Evaluate this business idea. Cover target customers, pricing assumptions, competitors to research and a first-week validation plan: '},
  {id:'p5',category:'Marketing',title:'Find the right words',text:'Create three campaign directions for this product. Include audience, central idea, headline and a measurable goal: '},
  {id:'p6',category:'Writing',title:'Make every sentence count',text:'Edit this draft for clarity, rhythm and concise language while preserving my voice. Explain the key edits: '},
  {id:'p7',category:'Design',title:'Build a visual direction',text:'Develop a design direction for this brief: include hierarchy, typography, colors, interaction and accessibility decisions: '},
  {id:'p8',category:'Website Development',title:'From brief to browser',text:'Plan a responsive website for this brief. Include routes, components, data model, core interactions and implementation steps: '},
  {id:'p9',category:'Social Media',title:'A week of useful content',text:'Create a seven-day social content plan for this brand. Include a hook, format, useful takeaway and call to action for each post: '},
  {id:'p10',category:'Creative',title:'Go beyond the obvious',text:'Generate ten distinct directions for this creative problem, then combine the strongest two into one original concept: '},
];
