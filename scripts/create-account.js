const express = require('express');
const app = express();
const fs = require("fs");
const mysql = require('mysql2');
const crypto = require('crypto');

// Notice that this is a 'POST'
app.post('/add-users', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    console.log("Name", req.body.name);
    console.log("Email", req.body.email);

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'comp2800'
    });
    connection.connect();
    // TO PREVENT SQL INJECTION, DO THIS:
    // (FROM https://www.npmjs.com/package/mysql#escaping-query-values)
    connection.query('INSERT INTO users (name, email) values (?, ?)', [req.body.name, req.body.email],
        function(error, results, fields) {
            if (error) {
                console.log(error);
            }
            //console.log('Rows returned are: ', results);
            res.send({ status: "success", msg: "Record added." });

        });
    connection.end();

});



// Put that updates values to change data stored in db
app.put('/update-users', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'comp2800'
    });
    connection.connect();
    console.log("update values", req.body.user_name, req.body.first_name, req.body.last_name,
        req.body.email_address, req.body.password, req.body.id);
    connection.query('UPDATE bby12users SET user_name = ? AND first_name = ? AND last_name = ? AND email_address = ? AND password = ? WHERE ID = ?', [req.body.user_name, req.body.first_name, req.body.last_name, req.body.email_address, req.body.password, req.body.id],
        function(error, results, fields) {
            if (error) {
                console.log(error);
            }
            //console.log('Rows returned are: ', results);
            res.send({ status: "Success", msg: "User information updated." });

        });
    connection.end();

});


module.exports = {
    createAccount: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'comp2800'
        });
        connection.connect();
        let username = req.body.username;
        let pass = req.body.password;
        if (username === req.body["username-verify"] && pass === req.body["password-verify"]) console.log("same");
        else console.log("not same");
        // const hash = crypto.createHash('sha256').update(pass).digest('hex');
        // connection.query('INSERT INTO bby12users (username, password, fName, lName, email, phoneNo, location, description) values (?, ?,?,?,?,?,?,?)', 
        // [username, hash, req.body["first-name"],req.body["last-name"],req.body["company-name"],req.body["email"],req.body["phone-num"],location, req.body["description"]],
        //     function(error, results, fields) {
        //         if (error) {
        //             console.log(error);
        //         }
        //         //console.log('Rows returned are: ', results);
        //         res.send({ status: "success", msg: "Record added." });

        //     });
        connection.end();
    }
};