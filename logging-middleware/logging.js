const fs = require('fs');
const path = require('path');

function logger(req, res, next) {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  fs.appendFile(path.join(__dirname, '../access.log'), log, err => {
    if (err) console.error('Logging error:', err);
  });
  next();
}

module.exports = logger;
