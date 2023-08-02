# Web3Paypal - Backend

## About

This Web3Paypal project allow users to request ETH from another users and pay the pending request using an interactive website.
Backend of this project is used to query data from blockchain using Moralis API.

## API Details

1. /api/nameandbalance/:address - Return the name associated with the address & total balance in both in native and dollar value.
2. /api/history/:address - Returns the send/receive history of the given address.
3. /api/requests/:address - Returns the pending requests for the address.

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/0xSravan03/web3paypal-website.git
   cd web3paypal-website/backend
   ```

2. Install dependency

   ```bash
   npm install
   ```

3. Rename `.env.example` to `.env` and paster your Moralis API key.

## Run

To start the backend -

```bash
npm run start
```
