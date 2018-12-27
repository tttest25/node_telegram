'use strict';

const express = require('express');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello 4 world\n');
});

app.listen(PORT, HOST);
console.log(`Running 3 on http://${HOST}:${PORT}`);