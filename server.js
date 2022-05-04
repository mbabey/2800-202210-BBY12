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

con.connect(function(err) {
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
    .post((req, res, ) => {
        let email = req.body.email.trim();
        let pass = req.body.password;
        const hash = crypto.createHash('sha256').update(pass).digest('hex');
        try {
            con.query('Select * from (`BBY12users`) Where (`username` = ?) AND (`password` = ?)', [email, hash], function(err, results, ) { // Change `username` to `email` in legit database
                if (results.length > 0) { //TODO: Change condition to password check;
                    req.session.loggedIn = true;
                    req.session.email = email;
                    req.session.admin = false;

                    con.query('Select * from (`BBY12admins`) Where (`username` = ?)', [email], function(err, results) {
                        if (err) throw err;
                        if (results.length > 0) {
                            console.log("in admin true");
                            req.session.admin = true;
                        }
                        req.session.save();
                    })

                } else {
                    console.log("Email/password combination not found");
                }
            });
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
        }
    });

app.get('/profile', (req, res) => {
    let profilePage = fs.readFileSync('./views/edit-profile.html', 'utf8');
    res.send(profilePage);
});

app.get('/create-account', (req, res) => {
    let createAccountPage = fs.readFileSync('./views/create-account.html', 'utf8');
    res.send(createAccountPage);
});

app.get('/logout', (req, res) => {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

//grab data from the logged-in user table in db
//not working
app.get('/get-users', function (req, res) {

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'comp2800'
    });
    connection.connect();
    
    //fetch from that specific logged-in user
    //need the current session's username to locate the data, not sure if it's working
    let session_username = req.session.username;
    connection.query('SELECT (`fName`, `lName`, `email`, `password`) FROM (`bby12users`) WHERE (`username` = ?)', [session_username], function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log('Rows returned are: ', results);
        res.send({ status: "success", rows: results });
  
    });
    connection.end();
  
  
  });
  
  // Post that updates values to change data stored in db
  app.post('/update-users', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'comp2800'
    });
    connection.connect();
  console.log("update values", req.body.username, req.body.fName, req.body.lName,
  req.body.email, req.body.password)
    connection.query('UPDATE users SET fName = ? AND lName = ? AND email = ? AND password = ? WHERE username = ?',
          [req.body.username, req.body.fName, req.body.lName, req.body.email, req.body.password],
          function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "Success", msg: "User information updated." });
  
    });
    connection.end();
  
  });
  
