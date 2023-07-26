const express = require("express");
const Moralis = require("moralis").default;
require("dotenv").config();
const cors = require("cors");
const PORT = 3001;
const app = express();

// Moralis API key
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test");
});

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server is Running on Port: ${PORT}`);
});
