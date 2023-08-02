"use strict";

const express = require("express");
const Moralis = require("moralis").default; // importing moralis for querying the data from contract
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const app = express();
const ABI = require("./abi.json"); // importing contract abi
const contractAddress = "0x437a10e0B3ac1bf8c9B582Ba7FD4a1A815Dfc56C"; // web3Paypal contract address

// Moralis API key
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

app.get("/api/nameandbalance/:address", async (req, res) => {
  const { address } = req.params;

  if (!address || address.length != 42) {
    res.status(400).json({ msg: "Invalid Wallet Address" });
  }

  try {
    // from Moralis doc, this how we create the request to query the data
    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain: "0x13881", // hex of polygon mumbai chain id
      address: contractAddress,
      functionName: "getMyName", // function name
      abi: ABI,
      params: { _user: address }, // passing parameter
    });

    // get user wallet balance
    const response2 = await Moralis.EvmApi.balance.getNativeBalance({
      chain: "0x13881",
      address: address,
    });

    // get token price (using matic token address in the ethereum network)
    const response3 = await Moralis.EvmApi.token.getTokenPrice({
      chain: "0x1",
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    });

    const balance = (response2.raw.balance / 1e18).toFixed(2);

    // response.jsonResponse - contains the result
    // sending json response back to client
    res.status(200).json({
      name: response.jsonResponse, // as per our contract 0 th index is name and 1 st index is a boolean value
      balance: balance,
      usdPrice: (response3.raw.usdPrice * balance).toFixed(2),
    });
  } catch (err) {
    console.error(err.message);
    res.status(404).end();
  }
});

app.get("/api/history/:address", async (req, res) => {
  const { address } = req.params;

  if (!address || address.length != 42) {
    res.status(400).json({ msg: "Invalid Wallet address" });
  }

  try {
    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain: "0x13881", // hex of polygon mumbai chain id
      address: contractAddress,
      functionName: "getHistory", // function name
      abi: ABI,
      params: { _user: address }, // passing parameter
    });

    // creating array of objects using response
    const data = response.raw.map((history, index) => {
      return {
        key: index + 1,
        type: history[0],
        amount: history[1],
        message: history[2],
        address: history[3],
        name: history[4],
      };
    });

    res.json(data.reverse());
  } catch (err) {
    console.error(err.message);
    res.status(404).end();
  }
});

// Fetch all requests that is available for the given address
app.get("/api/requests/:address", async (req, res) => {
  const { address } = req.params;

  if (!address || address.length != 42) {
    res.status(400).json({ msg: "Invalid Wallet address" });
  }

  try {
    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain: "0x13881", // hex of polygon mumbai chain id
      address: contractAddress,
      functionName: "getMyRequests", // function name
      abi: ABI,
      params: { _user: address }, // passing parameter
    });

    const formattedData = [];
    for (let i = 0; i < response.raw["0"].length; i++) {
      const obj = {};
      obj.id = i;
      obj.requestor = response.raw["0"][i];
      obj.amount = response.raw["1"][i];
      obj.message = response.raw["2"][i];
      obj.requestorName = response.raw["3"][i];
      formattedData.push(obj);
    }
    res.status(200).json(formattedData);
  } catch (err) {
    console.error(err.message);
    res.status(404).end();
  }
});

// Starting Moralis and Server
const startServer = async () => {
  await Moralis.start({
    apiKey: API_KEY,
  });

  app.listen(PORT, (err) => {
    if (err) console.error(err.message);
    console.log(`Server is Running on Port: ${PORT}`);
  });
};

// Call startServer()
startServer();
