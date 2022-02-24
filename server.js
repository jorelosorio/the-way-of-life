const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8081;

app.use(express.static(`${__dirname}/docs`));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port);

console.log(`Server started at http://localhost:${port}`);
