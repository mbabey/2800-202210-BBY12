'use strict';
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
    console.log(req.session.success);
    if (req.session.user) {
        res.redirect('/profile'); // /profile for now, but will be /home in later versions 
    } else {
        res.redirect('/login');
    }
});

app.route('/login')
    .get((req, res, next) => {
        let loginPage = fs.readFileSync('./views/login.html', 'utf8');
        res.send(loginPage);
        next();
    })
    .post((req, res, next) => {
        let email = req.body.email.trim();
        console.log(email);
        console.log(req.body.password);

        con.query('Select * from (`user`) Where (`username` = ?) AND (`password` = ?)', [email, req.body.password], function(err, results, fields) { // Change `username` to `email` in legit database
            if (results.length > 0) { //TODO: Change condition to password check;
                console.log(results[0]);
                //req.session.loggedIn = true;
                req.session.regenerate(function() {
                    // Store the user's primary key
                    // in the session store to be retrieved,
                    // or in this case the entire user object
                    req.session.user = email;
                    req.session.success = 'Authenticated as ' + email +
                        ' click to <a href="/logout">logout</a>. ' +
                        ' You may now access <a href="/restricted">/restricted</a>.';
                    // res.redirect('/');
                });
            } else {
                console.log("Email/password combination not found");
            }
        });
        res.redirect('/');
        next();
    });

app.get('/profile', (req, res) => {
    console.log("At /profile");
    console.log(req.session);
});

app.get('/create-account', (req, res, next) => {
    let createAccountPage = fs.readFileSync('./views/create-account.html', 'utf8');
    res.send(createAccountPage);
    next();
});

app.get('/logout', (req, res) => {
    req.session.destroy(function() {
        res.redirect('/');
    });

    // req.session.loggedIn = false;
    // res.redirect('/');
});