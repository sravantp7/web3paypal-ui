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

app.get("/api/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query;

  try {
    // from Moralis doc, this how we create the request to query the data
    const response = await Moralis.EvmApi.utils.runContractFunction({
      chain: "0x13881", // hex of polygon mumbai chain id
      address: contractAddress,
      functionName: "getMyName", // function name
      abi: ABI,
      params: { _user: userAddress }, // passing parameter
    });

    // response.jsonResponse - contains the result
    // sending json response back to client
    res.status(200).json({
      name: response.jsonResponse[0], // as per our contract 0 th index is name and 1 st index is a boolean value
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
