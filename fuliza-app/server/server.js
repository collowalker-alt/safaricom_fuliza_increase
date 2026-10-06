import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'..')));

const allowed=[
 {increase:15000,fee:630},{increase:20000,fee:730},{increase:25000,fee:880},
 {increase:30000,fee:990},{increase:35000,fee:1050}
];

app.post('/api/payment/prompt',(req,res)=>{
 const {msisdn,amount,increase}=req.body||{};
 const plan=allowed.find(x=>x.increase===Number(increase)&&x.fee===Number(amount));
 if(!plan || !/^2547\d{8}$/.test(String(msisdn||'')))
   return res.status(400).json({message:'Invalid request details.'});

 // Demo mode: connect this server endpoint to an authorized Daraja M-PESA Express
 // integration before using real customer payments. Never put Daraja credentials in app.js.
 const demo=process.env.DEMO_MODE !== 'false';
 if(demo) return res.json({
   demo:true,
   message:`Demo prompt prepared for ${msisdn}. In production, an authorized M-PESA Express prompt would be sent to this number for ${plan.fee} KSh.`
 });
 return res.status(501).json({message:'Production M-PESA integration is not configured.'});
});

app.post('/api/payment/callback',(req,res)=>{
 console.log('M-PESA callback received:',JSON.stringify(req.body));
 res.json({ResultCode:0,ResultDesc:'Accepted'});
});

app.get('*',(req,res)=>{
 res.sendFile(path.join(__dirname,'..','index.html'));
});

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Fuliza Increase app running on ${port}`));