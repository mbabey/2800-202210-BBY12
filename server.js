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
        if (!req.session.loggedIn) {
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
            con.query('SELECT * FROM BBY_12_users WHERE (`username` = ?) AND (`password` = ?);', [user, hash], function (err, results,) {
                if (results && results.length > 0) {
                    login(req, user);
                }
            });
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
        }
    });

function login(req, user) {
    req.session.loggedIn = true;
    req.session.username = user;
    req.session.admin = false;

    con.query('Select * from (`BBY_12_admins`) Where (`username` = ?)', [user], function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
            req.session.admin = true;
        }
        req.session.save();
    });
}

app.route('/create-account')
    .get((req, res) => {
        if (!req.session.loggedIn) {
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

//get data from BBY_12_post and format the posts
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

app.get('/profile', (req, res) => {
    if (req.session.loggedIn) {
        let profilePage = fs.readFileSync('./views/profile.html', 'utf8');
        res.send(profilePage);
    } else {
        res.redirect('/');
    }
});

app.get('/get-users', function (req, res) {
    con.query('SELECT * FROM `BBY_12_users` WHERE (`username` = ?)', [req.session.username], function (error, results, fields) {
        if (error) throw error;
        res.setHeader('content-type', 'application/json');
        res.send(results);
    });
});

// Post that updates values to change data stored in db
app.post('/update-users', function (req, res) {
    con.query('UPDATE `BBY_12_users` SET (`fName` = ?) AND (`lName` = ?) AND (`email` = ?) AND (`password` = ?) WHERE (`username` = ?);', [req.body.username, req.body.fName, req.body.lName, req.body.email, req.body.password],
        function (error, results, fields) {
            if (error) throw error;
            res.setHeader('Content-Type', 'application/json');
            res.send({ status: "Success", msg: "User information updated." });
        });
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
        if (req.session.loggedIn && req.session.admin) {
            let accountAddPage = fs.readFileSync('./views/admin-add-account.html', 'utf8');
            res.send(accountAddPage);
        } else {
            res.redirect('/');
        }
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

    app.get('/admin-view-accounts', function (req, res) {
        if (req.session.loggedIn && req.session.admin == true) {
            let session_username = req.session.username;
            let admin = 'SELECT * FROM BBY_12_users WHERE BBY_12_users.username = ?';
            let username = "<h3>";
            let first_name = "<p>";
            let last_name = "<p>";
            let business_name = "<p>";
            con.query(admin, [session_username], function (err, results, fields) {
            if (err) throw err;
                console.log(results);
                
                username += results[0].username + "</h3>";
                first_name += results[0].fName + "</p>";
                last_name += results[0].lName + "</p>";
                business_name += results[0].cName + "</p>";
            });
            let users = 'SELECT * FROM BBY_12_users';
            con.query(users, function (err, results, fields) {
                if (err) throw err;
    
                let table = "<table><tr><th>Username</th><th class=\"admin-user-info\">First Name</th><th class=\"admin-user-info\">Last Name</th><th class=\"admin-user-info\">Business Name</th></tr>";
                for (let i = 0; i < results.length; i++) {
                    table += "<tr><td>" + results[i].username + "</td><td class=\"admin-user-info\">"
                        + results[i].fName + "</td><td class=\"admin-user-info\">" 
                        + results[i].lName + "</td><td class=\"admin-user-info\">"
                        + results[i].cName + "</td></tr>";
                }
                table += "</table>";
                let adminViewAcc = fs.readFileSync('./views/admin-view-accounts.html', 'utf8');
                let adminViewAccDOM = new JSDOM(adminViewAcc);
                adminViewAccDOM.window.document.getElementById("user-list").innerHTML = table;
                adminViewAccDOM.window.document.getElementById("u-name").innerHTML = username;
                adminViewAccDOM.window.document.getElementById("name").innerHTML = first_name + last_name;
                adminViewAccDOM.window.document.getElementById("b-name").innerHTML = business_name;
                let adminViewAccPage = adminViewAccDOM.serialize();
                res.send(adminViewAccPage);
            });
        } else {
            res.redirect("/");
        }
    });
// change