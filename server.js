'use strict';
// const { Router } = require('express');
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');
const crypto = require('crypto');
const {
    JSDOM
} = require('jsdom');

const createAccount = require('./scripts/create-account');
const dbInitialize = require('./db-init');

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

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("SQL Connected");
});

const port = 8000;
app.listen(port, () => {
    console.log('Gro-Operate running on port: ' + port);
    dbInitialize.dbInitialize();
});

app.get('/', (req, res) => {
    console.log(req.session);
    if (req.session.loggedIn) {
        if (req.session.admin)
            res.redirect('/admin-dashboard'); // TEMP show case that admin accounts are different, will remove once dash board button is implemented
        else
            res.redirect('/home'); // /edit-profile for now, but will be /home in later versions 
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
        const hash = crypto.createHash('sha256').update(pass).digest('hex'); // this is kinda insecure; we should encrypt before we send
        try {
            con.query('SELECT * FROM `BBY-12-Users` WHERE (`username` = ?) AND (`password` = ?);', [user, hash], function(err, results, ) {
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

    con.query('Select * from (`BBY-12-Admins`) Where (`username` = ?)', [user], function(err, results) {
        if (err) throw err;
        if (results.length > 0) {
            req.session.admin = true;
        }
        req.session.save();
    });
}

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

    con.query('SELECT * FROM `BBY-12-Admins` WHERE (`username` = ?);', [user], function(err, results) {
        if (err) throw err;
        if (results.length > 0) {
            req.session.admin = true;
        }
        req.session.save();
    });
}

app.get('/get-users', function(req, res) {
    con.query('SELECT * FROM `BBY-12-Users` WHERE (`username` = ?)', [req.session.username], function(error, results, fields) {
        if (error) {
            console.log(error);
        }
        res.setHeader('content-type', 'application/json');
        res.send(results);
    });
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
        req.body.email, req.body.password)
    connection.query('UPDATE `BBY-12-Users` SET (`fName` = ?) AND (`lName` = ?) AND (`email` = ?) AND (`password` = ?) WHERE (`username` = ?);', [req.body.username, req.body.fName, req.body.lName, req.body.email, req.body.password],
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
        let users = 'SELECT * FROM `BBY-12-Users`;';
        con.query(users, function(err, results, fields) {
            if (err) throw err;
            console.log(results);
            let table = "<table id='user-accounts'><th>User Accounts</th>";
            for (let i = 0; i < results.length; i++) {
                table += "<tr><td>" + results[i].username + "</td><td>" +
                    results[i].fName + "</td><td>" + results[i].lName + "</td></tr>";
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

//get data from BBY-12post and format the posts
app.get('/home', (req, res) => {
    if (req.session.loggedIn) {
        console.log("Logged in from username:" + req.session.username);
        let profilePage = fs.readFileSync('./views/home.html', 'utf8').toString();
        let profileDOM = new JSDOM(profilePage);
        profileDOM.window.document.getElementsByTagName("title").innerHTML = "Gro-Operate | " + req.session.fName + "'s Profile";
        profileDOM.window.document.getElementById("profile-name").innerHTML = req.session.username;
        con.query(
            `SELECT * FROM \`BBY-12-post\` WHERE username = "${req.session.username}";`,
            function(error, results, fields) {
                // results is an array of records, in JSON format
                console.log("Results from DB", results);
                //let myResults = results;
                if (error) {
                    console.log(error);
                }
                // get data, format output
                let postSection = "<div class='post-block>";
                let post;
                for (let i = 0; i < results.length; i++) {
                    post += "<div class='post'><h1 class='post-title'>" + results[i].postTitle + "</h1><h3 class='post-business-name'>" + results[i].businessName +
                        "</h3><div class='post-images'>" + "</div><p class='post-description'>" + results[i].content +
                        "</p><p class='post-timestamp'><small>" + results[i].timestamp + "</small></p></div>";
                }
                // don't forget the end
                postSection += "</div>"
                var profilePage = profileDOM.serialize(); //this is the profile page
                res.send(profilePage + postSection); //sends the profile page and the posts
            });
    } else {
        // not logged in - no session and no access, redirect to root!
        res.redirect("/");
    }
});

app.get('/get-users', function(req, res) {
    con.query('SELECT * FROM `BBY-12-Users` WHERE (`username` = ?)', [req.session.username], function(error, results, fields) {
        if (error) {
            console.log(error);
        }
        res.setHeader('content-type', 'application/json');
        res.send(results);
    });
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
        req.body.email, req.body.password)
    connection.query('UPDATE users SET (fName = ? , lName = ? , email = ? , password = ?) WHERE username = ?', [req.body.username, req.body.fName, req.body.lName, req.body.email, req.body.password],
        function(error, results, fields) {
            if (error) {
                console.log(error);
            }
            //console.log('Rows returned are: ', results);
            res.send({ status: "Success", msg: "User information updated." });

        });
    connection.end();

});