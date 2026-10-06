# Fuliza Increase Web App

Mobile-first prototype with:
- Five requested increase tiers and fees
- Dedicated M-PESA number field
- Kenyan number validation
- Server-side payment prompt boundary
- Demo mode
- Callback endpoint placeholder
- PWA manifest

## Run
npm install
npm run dev

## Production M-PESA
Replace the demo section in `server/server.js` with an authorized Safaricom Daraja/M-PESA Express integration. Keep credentials in environment variables and implement the official callback/result handling. Do not place API credentials in frontend JavaScript.

## Important
This prototype does not claim to be an official Safaricom service and does not guarantee a Fuliza limit increase. Production use should only proceed with appropriate authorization and approved payment/service integrations.
