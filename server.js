// const { Router } = require('express');
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

app.use(session({ secret: 'shoredoes', name: 'groopsess', resave: false, saveUninitialized: true }));

const port = 8000;

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comp2800'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("SQL Connected");
});

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

app.route('/login')
    .get((req, res) => {
        let loginPage = fs.readFileSync('./views/login.html', 'utf8');
        res.send(loginPage);

    })
    .post((req, res) => {
        let username = req.body.username.trim();
        console.log(username);
        console.log(req.body.password);

        con.query('Select * from `user` Where `username` = ?', [username], function(err, results, fields) {
            if (results.length > 0) { //TODO: Change condition to password check;
                console.log(results[0]);
            } else {
                console.log("Username password combination not found");
            }
        });
        res.redirect('/');
    });

app.get('/create-account', (req, res) => {
    let createAccountPage = fs.readFileSync('./views/create-account.html', 'utf8');
    res.send(createAccountPage);
});