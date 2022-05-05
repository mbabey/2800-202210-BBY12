'use strict';
// const { Router } = require('express');
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');
const crypto = require('crypto');

const createAccount = require('./scripts/create-account');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

app.use(session({ secret: 'shoredoes', name: 'groopsess', resave: false, saveUninitialized: true }));

const port = 8000;

const con = mysql.createConnection({
    host: '127.0.0.1',
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
        if (req.session.admin)
            res.redirect('/admin-dashboard'); // TEMP show case that admin accounts are different, will remove once dash board button is implemented
        else
            res.redirect('/edit-profile'); // /edit-profile for now, but will be /home in later versions 
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
        let user = req.body.username.trim();
        let pass = req.body.password;
        const hash = crypto.createHash('sha256').update(pass).digest('hex');
        try {
            con.query('Select * from (`bby12users`) Where (`username` = ?) AND (`password` = ?)', [user, hash], function(err, results, ) {
                if (results && results.length > 0) {
                    login(req, user);

                } else {
                    console.log("Username/password combination not found");
                }
            });
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
        }
    });

app.get('/profile', (req, res) => {
    let profilePage = fs.readFileSync('./views/profile.html', 'utf8');
    res.send(profilePage);
});

app.get('/edit-profile', (req, res) => {
    let editProfilePage = fs.readFileSync('./views/edit-profile.html', 'utf8');
    res.send(editProfilePage);
});

app.get('/admin-dashboard', (req, res) => {
    let adminDashPage = fs.readFileSync('./views/admin-dashboard.html', 'utf8');
    res.send(adminDashPage);
});

app.route('/admin-add-account')
    .get((req, res) => {
        let accountAddPage = fs.readFileSync('./views/admin-add-account.html', 'utf8');
        res.send(accountAddPage);
    })
    .post((req, res) => {
        createAccount.createAdmin(req, res)
            .then(function(result) {
                res.redirect('/admin-dashboard');
            })
            .catch(function(err) {
                console.log("Promise rejection error: " + err);
                res.redirect('/admin-add-account');
            });
    });

app.route('/create-account')
    .get((req, res) => {
        let createAccountPage = fs.readFileSync('./views/create-account.html', 'utf8');
        res.send(createAccountPage);
    })
    .post((req, res) => {
        createAccount.createAccount(req, res)
            .then(function(result) {
                login(req, req.body["username"]);
                //res.send({ status: "success", msg: "Record added." });
                res.redirect('/');
            })
            .catch(function(err) {
                console.log("Promise rejection error: " + err);
                //res.send({ status: "fail", msg: "Record not added." });
                res.redirect('/create-account');
            });

    });

app.get('/logout', (req, res) => {
    req.session.destroy(function() {
        res.redirect('/');
    });
});


function login(req, user) {
    req.session.loggedIn = true;
    req.session.username = user;
    req.session.admin = false;

    con.query('Select * from (`bby12admins`) Where (`username` = ?)', [user], function(err, results) {
        if (err) throw err;
        if (results.length > 0) {
            req.session.admin = true;
        }
        req.session.save();
    });
}

//grab data from the logged-in user table in db
//not working
app.get('/get-users', function(req, res) {

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
    connection.query('SELECT (`fName`, `lName`, `email`, `password`) FROM (`bby12users`) WHERE (`username` = ?)', [session_username], function(error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log('Rows returned are: ', results);
        res.send({ status: "success", rows: results });

    });
    connection.end();


});

// Post that updates values to change data stored in db
app.post('/update-users', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'comp2800'
    });
    connection.connect();
    console.log("update values", req.body.username, req.body.fName, req.body.lName,
        req.body.email, req.body.password);
    connection.query('UPDATE users SET fName = ? AND lName = ? AND email = ? AND password = ? WHERE username = ?', [req.body.username, req.body.fName, req.body.lName, req.body.email, req.body.password],
        function(error, results, fields) {
            if (error) {
                console.log(error);
            }
            //console.log('Rows returned are: ', results);
            res.send({ status: "Success", msg: "User information updated." });

        });
    connection.end();

});

app.get('/admin-view-accounts', function(req, res) {
    if (req.session.loggedIn && req.session.admin == true) {
        let session_username = req.session.username;
        con.query(
            "SELECT * FROM BBY12Admins WHERE BBY12Admins.username = ?", [session_username],
            function(err, results, fields) {
                console.log("results: ", results);
                console.log("results from db:", results, "and the # of records returned", results.length);

                if (err) {
                    console.log(err);
                }
                let list = "<ul>";
                for (let i = 0; i < results.length; i++) {
                    list += "<li>" + results[i].username + "</li>";
                }
                list += "</ul>";
                let adminViewAccountsPage = fs.readFileSync('./views/admin-view-accounts.html', 'utf8');
                res.send(adminViewAccountsPage + list);

            });
        con.end();
    } else {
        res.redirect("/");
    }
});