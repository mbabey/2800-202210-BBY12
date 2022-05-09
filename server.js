'use strict';
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');

const createAccount = require('./scripts/create-account');
const dbInitialize = require('./db-init');
const { redirect } = require('express/lib/response');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));

app.use(session({
    secret: 'shoredoes',
    name: 'groopsess',
    resave: false,
    saveUninitialized: true
}));

let con;
const port = 8000;
app.listen(port, () => {
    console.log('Gro-Operate running on port ' + port);
    dbInitialize.dbInitialize()
        .then(() => {
            con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'COMP2800'
            });
        }).then(() => {
            con.connect(function (err) {
                if (err) throw err;
            });
        });
});

app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        if (req.session.admin)
            res.redirect('/admin-dashboard'); // TEMP show case that admin accounts are different, will remove once dash board button is implemented
        else
            res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

app.route('/login')
    .get((req, res) => {
        if (req.session.loggedIn = false) {
            let loginPage = fs.readFileSync('./views/login.html', 'utf8');
            res.send(loginPage);
        } else {
            res.redirect('/');
        }
    })
    .post((req, res,) => {
        let user = req.body.username.trim();
        let pass = req.body.password;
        const hash = crypto.createHash('sha256').update(pass).digest('hex');
        try {
            con.query('SELECT * FROM `BBY-12-Users` WHERE (`username` = ?) AND (`password` = ?);', [user, hash], function (err, results,) {
                if (results && results.length > 0) {
                    login(req, user);
                }
            });
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
        }
    });

app.route('/create-account')
    .get((req, res) => {
        if (req.session.loggedIn = false) {
            let createAccountPage = fs.readFileSync('./views/create-account.html', 'utf8');
            res.send(createAccountPage);
        } else {
            res.redirect('/');
        }
    })
    .post((req, res) => {
        createAccount.createAccount(req, res)
            .then(function (result) {
                login(req, req.body["username"]);
                res.redirect('/');
            })
            .catch(function (err) {
                res.redirect('/create-account');
            });
    });

app.get('/logout', (req, res) => {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

function login(req, user) {
    req.session.loggedIn = true;
    req.session.username = user;
    req.session.admin = false;

    con.query('Select * from (`BBY-12-admins`) Where (`username` = ?)', [user], function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
            req.session.admin = true;
        }
        req.session.save();
    });
}

app.get('/profile', (req, res) => {
    if (req.session.loggedIn) {
        let profilePage = fs.readFileSync('./views/profile.html', 'utf8');
        res.send(profilePage);
    } else {
        res.redirect('/');
    }
});

app.get('/admin-dashboard', (req, res) => {
    if (req.session.loggedIn && req.session.admin) {
        let adminDashPage = fs.readFileSync('./views/admin-dashboard.html', 'utf8');
        res.send(adminDashPage);
    } else {
        res.redirect('/');
    }
});

app.route('/admin-add-account')
    .get((req, res) => {
        let accountAddPage = fs.readFileSync('./views/admin-add-account.html', 'utf8');
        res.send(accountAddPage);
    })
    .post((req, res) => {
        createAccount.createAdmin(req, res)
            .then(function (result) {
                res.redirect('/admin-dashboard');
            })
            .catch(function (err) {
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
            .then(function (result) {
                login(req, req.body["username"]);
                res.redirect('/');
            })
            .catch(function (err) {
                res.redirect('/create-account');
            });
    });

app.get('/logout', (req, res) => {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

function login(req, user) {
    req.session.loggedIn = true;
    req.session.username = user;
    req.session.admin = false;

    con.query('SELECT * FROM `BBY-12-Admins` WHERE (`username` = ?);', [user], function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
            req.session.admin = true;
        }
        req.session.save();
    });
}

app.get('/get-users', function (req, res) {
    con.query('SELECT * FROM `BBY-12-Users` WHERE (`username` = ?)', [req.session.username], function (error, results, fields) {
        if (error) throw err;
        res.setHeader('content-type', 'application/json');
        res.send(results);
    });
});

// Post that updates values to change data stored in db
app.post('/update-users', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    con.query('UPDATE `BBY-12-Users` SET (`fName` = ?) AND (`lName` = ?) AND (`email` = ?) AND (`password` = ?) WHERE (`username` = ?);', [req.body.username, req.body.fName, req.body.lName, req.body.email, req.body.password],
        function (error, results, fields) {
            if (error) throw error;
            res.send({ status: "Success", msg: "User information updated." });
        });
});

app.get('/admin-view-accounts', function (req, res) {
    if (req.session.loggedIn && req.session.admin == true) {
        let users = 'SELECT * FROM `BBY-12-Users`';
        con.query(users, function (err, results, fields) {
            if (err) throw err;

            let table = "<table><tr><th>Username</th><th class=\"admin-user-info-desktop\">First Name</th><th class=\"admin-user-info-desktop\">Last Name</th><th class=\"admin-user-info-desktop\">Business Name</th></tr>";
            for (let i = 0; i < results.length; i++) {
                table += "<tr><td>" + results[i].username + "</td><td class=\"admin-user-info-desktop\">"
                    + results[i].fName + "</td><td class=\"admin-user-info-desktop\">" + results[i].lName + "</td><td class=\"admin-user-info-desktop\">"
                    + results[i].cName + "</td></tr>";
            }
            table += "</table>";
            let adminViewAcc = fs.readFileSync('./views/admin-view-accounts.html', 'utf8');
            let adminViewAccDOM = new JSDOM(adminViewAcc);
            adminViewAccDOM.window.document.getElementById("user-list").innerHTML = table;
            let adminViewAccPage = adminViewAccDOM.serialize();
            res.send(adminViewAccPage);
        });
    } else {
        res.redirect("/");
    }
});

//get data from BBY-12-post and format the posts
app.get('/home', (req, res) => {
    if (req.session.loggedIn) {
        let profilePage = fs.readFileSync('./views/home.html', 'utf8').toString();
        let profileDOM = new JSDOM(profilePage);
        profileDOM.window.document.getElementsByTagName("title").innerHTML = "Gro-Operate | " + req.session.fName + "'s Home Page";
        profileDOM.window.document.querySelector(".profile-name-spot").innerHTML = req.session.username;
        profilePage = profileDOM.serialize();
        res.send(profilePage);
    } else {
        res.redirect("/");
    }
});