const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

const mock = [];
for (let i = 24500; i <= 25500; i += 100) {
  mock.push({
    strike: i,
    bulls: Math.floor(Math.random() * 100000),
    bears: Math.floor(Math.random() * 100000)
  });
}

app.get('/api/oi-data', (req, res) => {
  res.json(mock);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}`));
