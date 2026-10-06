# Fuliza Increase Assistance Web App

Mobile-first React + Node/Express starter for a Fuliza-limit assistance/payment flow.

## Packages
- KSh 15,000 request — KSh 630
- KSh 20,000 request — KSh 730
- KSh 25,000 request — KSh 880
- KSh 30,000 request — KSh 990
- KSh 35,000 request — KSh 1,050

## Run
1. Install Node.js 20+.
2. From this folder run `npm install`.
3. Run `npm run dev`.
4. Open the Vite URL shown by the terminal.

The payment endpoint starts in DEMO_MODE. It does not send real money prompts.

## Production
Use an authorized Safaricom Daraja/M-PESA application and place credentials only on the server. Implement the approved M-Pesa Express flow and callback handling in `server/src/server.js`. Do not expose API secrets in React/browser code.

## Important product/legal note
This interface must not be represented as an official Safaricom website or promise a guaranteed Fuliza limit unless the required authorization exists. A payment should not be presented as guaranteeing a particular credit-limit decision.
