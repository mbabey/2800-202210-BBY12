const { Router } = require('express');
const express = require('express');
const session = require('express-session');
//const http = require('http');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

app.use(session({secret: 'shoredoes', name: 'groopsess', resave: false, saveUninitialized: true}));

const port = 8000;
app.listen(port, () => {
    console.log('Gro-Operate running on port: ' + port);
});

app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/profile'); // /profile for now, but will be /home in later versions 
    } else {
        res.redirect('/login');
    }
});

app.post('/createAccount', (req, res) =>{
    console.log('Login Post');
});

app.get('/login', (req, res) => {
    let loginPage = fs.readFileSync('./views/login.html', 'utf8');
    res.set('server', 'serversomething');
    res.set('x-powered-by', 'anything');
    res.send(loginPage);
    
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'store'
    });

    con.connect(function(err) {
            if(err) throw err;
            console.log("SQL Poggers");
            con.query("SELECT * FROM `user`", function (err, result, fields){
                    if(err) throw err;
                    console.log(result);
            });
    });
});

app.get('/createAccount', (req, res) => {
    let createAccountPage = fs.readFileSync('./views/createAccount.html');
    res.set('server', 'serversomething');
    res.set('x-powered-by', 'anything');
    res.send(createAccountPage);
});
