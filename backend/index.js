const express = require("express");
const Moralis = require("moralis").default; // importing moralis for querying the data from contract
require("dotenv").config();
const cors = require("cors");
const PORT = 3001;
const app = express();
const ABI = require("./abi.json"); // importing contract abi
const contractAddress = "0xE6189E1925cA3aD75f714e3338D865E5192bEF37";

// Moralis API key
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

app.get("/api/NameandBalance/:address", async (req, res) => {
  const { address } = req.params;

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

    console.log(response3.raw);

    const balance = (response2.raw.balance / 1e18).toFixed(2);

    // response.jsonResponse - contains the result
    // sending json response back to client
    res.status(200).json({
      name: response.jsonResponse, // as per our contract 0 th index is name and 1 st index is a boolean value
      balance: balance,
      usdPrice: (response3.raw.usdPrice * balance).toFixed(2),
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Starting Moralis and Server
const startServer = async () => {
  await Moralis.start({
    apiKey: API_KEY,
  });

  app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`Server is Running on Port: ${PORT}`);
  });
};

// Call startServer()
startServer();
