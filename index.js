const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const AuthDB = require('./Auth/AuthDB');

//middlewares (Order MATTERS)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.set('views', path.join(__dirname + 'views'))

app.use(express.static(path.join(__dirname, 'views/Login_Page')));
app.use(express.static(path.join(__dirname, 'views/Signup_Page')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/views/Login_Page/index.html'));
});

app.get('/signup', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/views/Signup_Page/index.html'));
});

app.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (AuthDB.add(username, password)) {
        res.sendFile(path.join(__dirname, './views/Login_Status/MainPage.html'));
    } else {
        res.status(404).send('Error in adding user');
    }
});


app.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/views/Login_Page/index.html'));
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (AuthDB.verify(username, password)) {
        res.sendFile(path.join(__dirname, './views/Login_Status/MainPage.html'));
    } else {
        res.status(404).send('Error in adding user');
    }
});
app.get('/*', (req, res) => {
    res.status(404).send('Error Page Not Found!');
});


app.listen(process.env.PORT, () => {
    console.log('server started');
});

