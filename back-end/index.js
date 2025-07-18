const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
const urlMap = {};
function shorten() {
    let result = crypto.randomBytes(3).toString('hex'); 
    return result;
}
app.post('/shorten', (req, res) => {
  let { originalUrl, validity, shortCode } = req.body;
  if (!originalUrl || typeof originalUrl !== 'string') {
    return res.status(400).json({ error: 'originalUrl is required and must be a string.' });
  }
  validity = parseInt(validity) || 30;
  if (!shortCode || urlMap[shortCode]) {
    shortCode = shorten();
  }
  const expiry = new Date(Date.now() + validity * 60 * 1000);
  urlMap[shortCode] = {
    originalUrl,
    expiresAt: expiry
  };
  const shortUrl = `http://localhost:3000/${shortCode}`;

  res.status(201).json({
    shortUrl,
    expiresAt: expiry
  });
});
app.get('/shortCode', (req, res) => {
  const { shortCode } = req.params;
  const data = urlMap[shortCode];
  if (!data) {
    return res.status(404).json({ error: 'Short code not found.' });
  }
  const now = new Date();
  if (now > new Date(data.expiresAt)) {
    return res.status(410).json({ error: 'Link is expired.' });
  }
  res.redirect(data.originalUrl);
});
const port = 3000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
