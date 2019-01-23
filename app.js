const path = require('path');

console.log('started');

const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req, res) => res.send('Hello World!'));

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => res.send('nothing here'))

=======
app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> c5ee4b6df73aa7bb766fdfb3d4932dc05a805579

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


