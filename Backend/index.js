const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const axios = require('axios');
const port = 3000;
const INCH_DEV_API = process.env.INCH_DEV_API;

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

  app.get('/fetchAllowance', async (req, res) => {
    const { tokenOne, address } = req.query;
    // console.log(tokenOne,address);
    const url = "https://api.1inch.dev/swap/v6.0/1/approve/allowance";
    const config = {
      headers: {
        "Authorization": `Bearer ${INCH_DEV_API}`
      },
      params: {
        "tokenAddress": tokenOne,
        "walletAddress": address
      }
    };
  
    try {
      const response = await axios.get(url, config);
      res.json(response.data);
    } catch (error) {
      console.error('Error from 1inch API:', error.response.data);
      res.status(500).json({ error: 'An error occurred while fetching allowance' });
    }
  });

app.get('/fetchApproveTransaction', async (req, res) => {
  const { tokenOne } = req.query;
  const url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction";
  const config = {
    headers: {
      "Authorization": `Bearer ${INCH_DEV_API}`
    },
    params: {
      "tokenAddress": tokenOne,
    }
  };

  try {
    const response = await axios.get(url, config);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching approve transaction' });
  }
});

app.get('/fetchSwap', async (req, res) => {
  const { tokenOne, tokenTwo, tokenOneAmount, address, slippage } = req.query;
  const url = "https://api.1inch.dev/swap/v6.0/1/swap";
  const config = {
    headers: {
      "Authorization": `Bearer ${INCH_DEV_API}`
    },
    params: {
      "src": tokenOne,
      "dst": tokenTwo,
      "amount": tokenOneAmount.padEnd(tokenOne.decimals + tokenOneAmount.length, "0"),
      "from": address,
      "origin": address,
      "slippage": slippage
    }
  };

  try {
    const response = await axios.get(url, config);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      const { statusCode, description } = error.response.data;
      res.status(statusCode).json({ error: description });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});




Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on http://localhost:${port}`);
  });
});