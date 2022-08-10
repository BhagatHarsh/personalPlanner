const express = require('express');
const path = require('path');
const app = express();


// app.set('views', path.join(__dirname + 'views'))

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/*', (req, res) => {
    res.status(404).send('Error Page Not Found!');
});


app.listen(3000, () => {
    console.log('server started');
});
