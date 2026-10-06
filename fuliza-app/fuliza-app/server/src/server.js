import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app=express();
app.use(cors()); app.use(express.json());
const PORT=process.env.PORT||4000;
const DEMO_MODE=(process.env.DEMO_MODE||'true').toLowerCase()==='true';

app.get('/api/health',(req,res)=>res.json({ok:true,demo:DEMO_MODE}));

app.post('/api/payments/stkpush',async(req,res)=>{
  const {phone,amount,requestedLimit}=req.body||{};
  if(!/^254(7|1)\\d{8}$/.test(phone||'')) return res.status(400).json({message:'Enter a valid Kenyan M-PESA number.'});
  const allowed=[630,730,880,990,1050];
  if(!allowed.includes(Number(amount))) return res.status(400).json({message:'Invalid service fee.'});

  // DEMO_MODE keeps this project safe to test before authorized Daraja credentials are supplied.
  if(DEMO_MODE){
    return res.json({demo:true,merchantRequestId:'DEMO-'+crypto.randomBytes(5).toString('hex'),message:'Demo payment prompt created',requestedLimit});
  }

  // Production integration belongs here. Keep Daraja credentials server-side only.
  // Required environment variables depend on your approved Daraja application:
  // DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET, DARAJA_SHORTCODE, DARAJA_PASSKEY, DARAJA_CALLBACK_URL.
  return res.status(501).json({message:'Daraja production integration is not configured. Add your authorized M-PESA credentials and callback URL on the server.'});
});

app.post('/api/payments/callback',(req,res)=>{
  console.log('M-PESA callback received:',JSON.stringify(req.body));
  res.json({ResultCode:0,ResultDesc:'Accepted'});
});

app.listen(PORT,()=>console.log(`Fuliza assistance API listening on ${PORT} | DEMO_MODE=${DEMO_MODE}`));
