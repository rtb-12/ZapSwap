const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get("/tokenPrice", async (req, res) => {
  try {
    const {query} = req;
    if (!query.addressOne || !query.addressTwo) {
      return res.status(400).json({ error: 'addressOne and addressTwo are required' });
    }
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressOne
    })

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressTwo
    })

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice/responseTwo.raw.usdPrice
    }
    
    console.log(usdPrices);
    return res.status(200).json(usdPrices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on http://localhost:${port}`);
  });
});