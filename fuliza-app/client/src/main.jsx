import React, {useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ShieldCheck, Smartphone, ArrowRight, CheckCircle2, Clock3, HelpCircle, Menu, X, LockKeyhole} from 'lucide-react';
import './styles.css';

const PACKAGES=[
  {limit:15000,fee:630}, {limit:20000,fee:730}, {limit:25000,fee:880},
  {limit:30000,fee:990}, {limit:35000,fee:1050}
];

function money(n){return new Intl.NumberFormat('en-KE').format(n)}
function normalizePhone(v){
  const x=v.replace(/\\D/g,'');
  if(x.startsWith('254')) return x;
  if(x.startsWith('0')) return '254'+x.slice(1);
  if(x.startsWith('7')||x.startsWith('1')) return '254'+x;
  return x;
}

function App(){
 const [selected,setSelected]=useState(PACKAGES[0]);
 const [phone,setPhone]=useState('');
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState(null);
 const [menu,setMenu]=useState(false);
 const valid=/^254(7|1)\\d{8}$/.test(normalizePhone(phone));
 const feeLabel=useMemo(()=>`KSh ${money(selected.fee)}`,[selected]);
 async function requestPrompt(e){
   e.preventDefault(); if(!valid||busy)return;
   setBusy(true);setStatus(null);
   try{
     const r=await fetch('/api/payments/stkpush',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:normalizePhone(phone),amount:selected.fee,requestedLimit:selected.limit})});
     const data=await r.json();
     if(!r.ok) throw new Error(data.message||'Unable to initiate payment prompt.');
     setStatus({type:'success',message:data.demo?`Demo prompt ready for ${feeLabel}. Connect Daraja credentials to send the real M-PESA prompt.`:'Payment prompt sent. Check your phone and complete the M-PESA request.'});
   }catch(err){setStatus({type:'error',message:err.message});}
   finally{setBusy(false)}
 }
 return <div className="app">
  <header className="topbar"><div className="brand"><div className="brandMark">M</div><div><b>Fuliza Increase</b><span>Customer assistance portal</span></div></div><nav className={menu?'open':''}><a href="#plans" onClick={()=>setMenu(false)}>Packages</a><a href="#how" onClick={()=>setMenu(false)}>How it works</a><a href="#help" onClick={()=>setMenu(false)}>Help</a></nav><button className="menuBtn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
  <main>
   <section className="hero"><div className="heroCopy"><div className="eyebrow"><ShieldCheck size={16}/> Secure M-PESA payment flow</div><h1>Request a <span>Fuliza limit increase</span> with ease.</h1><p>Select the limit you want to request, enter your M-PESA number and receive a payment prompt. Eligibility and final limit approval remain subject to the applicable provider rules.</p><div className="trust"><span><LockKeyhole size={15}/> Secure checkout</span><span><Clock3 size={15}/> Fast prompt</span><span><Smartphone size={15}/> Mobile-first</span></div></div><div className="card checkout" id="plans"><div className="cardHead"><div><small>1. Choose requested limit</small><h2>Pick a package</h2></div><div className="pill">KES</div></div><div className="plans">{PACKAGES.map(p=><button key={p.limit} className={`plan ${selected.limit===p.limit?'active':''}`} onClick={()=>setSelected(p)}><div><strong>KSh {money(p.limit)}</strong><span>Requested increase</span></div><b>KSh {money(p.fee)}</b></button>)}</div><form onSubmit={requestPrompt}><label>2. M-PESA phone number</label><div className="phone"><span>+254</span><input inputMode="numeric" value={phone.replace(/^254/,'0')} onChange={e=>setPhone(e.target.value)} placeholder="0712 345 678" maxLength={13}/></div><div className="summary"><div><span>Requested limit</span><b>KSh {money(selected.limit)}</b></div><div><span>Service fee</span><b>{feeLabel}</b></div></div><button className="primary" disabled={!valid||busy}>{busy?'Sending prompt…':<>Request payment prompt <ArrowRight size={18}/></>}</button>{status&&<div className={`status ${status.type}`}>{status.type==='success'?<CheckCircle2 size={20}/>:<HelpCircle size={20}/>}<span>{status.message}</span></div>}</form><p className="legal">Never share your M-PESA PIN with anyone. A genuine M-PESA payment prompt is completed on your phone.</p></div></section>
   <section className="section" id="how"><div className="sectionTitle"><small>Simple process</small><h2>How it works</h2></div><div className="steps"><div><i>01</i><h3>Choose your request</h3><p>Select the Fuliza limit you want to request.</p></div><div><i>02</i><h3>Enter your number</h3><p>Use the M-PESA number that should receive the prompt.</p></div><div><i>03</i><h3>Approve payment</h3><p>Follow the M-PESA prompt on your phone and enter your PIN privately.</p></div></div></section>
   <section className="notice" id="help"><HelpCircle size={24}/><div><b>Important</b><p>Payment of a service fee does not guarantee a particular Fuliza limit. Final eligibility, credit assessment and limit decisions are controlled by the applicable service provider.</p></div></section>
  </main><footer><span>© {new Date().getFullYear()} Fuliza Increase Assistance</span><span>Payment integration requires authorized M-PESA/Daraja credentials.</span></footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
