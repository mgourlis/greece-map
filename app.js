const path = require('path');

console.log('started');

const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req, res) => res.send('Hello World!'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


