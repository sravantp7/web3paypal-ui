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

  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881", // hex of polygon mumbai chain id
    address: contractAddress,
    functionName: "getMyName",
    abi: ABI,
    params: { _user: userAddress },
  });

  // response.jsonResponse - contains the result
  res.status(200).json({
    name: response.jsonResponse[0],
  });
});

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
