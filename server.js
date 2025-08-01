
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/oi-data', async (req, res) => {
    try {
        const response = await axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY', {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
                'Referer': 'https://www.nseindia.com/',
            }
        });

        const data = response.data.records.data;
        const atmStrike = response.data.records.underlyingValue;
        const oiData = data.map(d => {
            const ce = d.CE || {};
            const pe = d.PE || {};
            return {
                strike: d.strikePrice,
                bulls: ce.changeinOpenInterest || 0,
                bears: pe.changeinOpenInterest || 0
            };
        });

        res.json({ atmStrike, data: oiData });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data", details: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
