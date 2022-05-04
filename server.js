'use strict';
// const { Router } = require('express');
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');
const crypto = require('crypto');

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

con.connect(function (err) {
    if (err) throw err;
    console.log("SQL Connected");
});

app.listen(port, () => {
    console.log('Gro-Operate running on port: ' + port);
});

app.get('/', (req, res) => {
    console.log(req.session);
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
    .post((req, res,) => {
        let email = req.body.email.trim();
        let pass = req.body.password;        
        const hash = crypto.createHash('sha256').update(pass).digest('hex');
        con.query('Select * from (`users`) Where (`username` = ?) AND (`password` = ?)', [email, hash], function (err, results, fields) { // Change `username` to `email` in legit database
            if (results.length > 0) { //TODO: Change condition to password check;
                req.session.loggedIn = true;
                req.session.email = email;
                req.session.save();
            } else {
                console.log("Email/password combination not found");
            }
        });
        res.redirect('/');
    });

app.get('/profile', (req, res) => {
    let profilePage = fs.readFileSync('./views/temp-profile.html', 'utf8');
    res.send(profilePage);
});

app.get('/create-account', (req, res) => {
    let createAccountPage = fs.readFileSync('./views/create-account.html', 'utf8');
    res.send(createAccountPage);
});

app.get('/logout', (req, res) => {
    req.session.destroy(function () {
        res.redirect('/');
    });
});