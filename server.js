// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

async function fetchOptionChain() {
  const resp = await axios.get(
    'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.nseindia.com'
      }
    }
  );
  return resp.data.records.data;
}

const app = express();
app.use(cors());

app.get('/api/oi-data', async (req, res) => {
  try {
    const data = await fetchOptionChain();
    const strikes = data.map(d => ({
      strike: d.strikePrice,
      bulls: d.PE?.changeinOpenInterest || 0,
      bears: d.CE?.changeinOpenInterest || 0
    }));
    res.json(strikes);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Error fetching NSE data');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}`));
