'use strict';
const mysql = require('mysql2');
const crypto = require('crypto');
const { render } = require('express/lib/response');

module.exports = {
    createAccount: async function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'comp2800'
        });
        connection.connect();
        let success = await insertDB(req, connection);
        connection.end();
        return success;
    },

    createAdmin: async function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'COMP2800'
        });
        connection.connect();
        let success = insertDB(req, connection);
        await success
            .then(function(result) {
                insertAdmin(req.body.username, connection)
                    .then()
                    .catch(function(err) {});
            }).catch(function(err) {});
        connection.end();
        return success;
    }
};


function insertDB(req, connection) {
    return new Promise((resolve, reject) => {
        let username = req.body.username;
        let pass = req.body.password;
        if (checkUsername(username, req) && checkPassword(pass, req)) {
            const hash = crypto.createHash('sha256').update(pass).digest('hex');
            let location = req.body["location-street"] + ", " + req.body["location-city"] + ", " + req.body["location-country"];
            connection.query('INSERT INTO \`BBY-12-Users\` (username, password, fName, lName, email, phoneNo, location, description) values (?, ?,?,?,?,?,?,?)', [username, hash, req.body["first-name"], req.body["last-name"], req.body["company-name"], req.body["email"], req.body["phone-num"], location, req.body["description"]],
                function(err) {
                    if (err) {
                        reject(new Error("User Insert failed"));
                    } else {
                        resolve(true);
                    }
                });
        } else {
            reject(new Error("Username/Password do not match"));
        };
    });
};

function insertAdmin(username, connection) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO \`BBY-12-Admins\` values(?)', [username],
            function(err) {
                if (err) {
                    reject(new Error("Admin Insert failed"));
                } else {
                    resolve(true);
                }
            });
    });
}

function checkUsername(username, req) {
    return (username); // TODO: Add additional checks: ie. min length
}

function checkPassword(pass, req) {
    return (pass && pass === req.body["password-verify"]); // TODO: Add additional checks: ie. min length
}