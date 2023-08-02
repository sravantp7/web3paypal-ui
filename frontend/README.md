# Web3Paypal Frontend

## About

Web3 Paypal is a smart-contract based payment solution which helps users to request ETH from another using by creating a new request and the receiver of the request can pay / reject the requests.

## Features

1. Connect wallet and view account details including balance in native token and dollars
2. Set name to wallet address.
3. View send/receive history of the connected wallet.
4. Create new requests to your friend with custom messages.

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/0xSravan03/web3paypal-website.git
   cd web3paypal-website/frontend
   ```

2. Install dependency

   ```bash
   npm install
   ```

3. Create a `.env.local` file and add
   ```bash
   NEXT_PUBLIC_ALCHEMY_API = <your alchemy api key>
   ```

## Run

To start the frontend -

```bash
npm run dev
```
