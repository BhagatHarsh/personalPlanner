const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.set('views', path.join(__dirname + 'views'))

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/views/Login_Page/index.html'));
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.sendFile(path.join(__dirname, './views/Login_Status/MainPage.html'));
});

app.get('/*', (req, res) => {
    res.status(404).send('Error Page Not Found!');
});


app.listen(3000, () => {
    console.log('server started');
});
