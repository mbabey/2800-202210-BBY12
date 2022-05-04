const mysql = require('mysql2');
const crypto = require('crypto');
const { render } = require('express/lib/response');

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
        let success = insertDB(req, connection)
            .then(function(result) {
                return result;
            })
            .catch(function(err) {
                console.log("Promise rejection error: " + err);
                return false;
            });

        connection.end();
        return success;
    }
};


function insertDB(req, connection) {
    return new Promise((resolve, reject) => {
        let username = req.body.username;
        let pass = req.body.password;
        if (checkUsername(username, req) && checkPassword(pass, req)) {
            //console.log(req.body);
            //console.log(location);
            //console.log([username, pass, req.body["first-name"], req.body["last-name"], req.body["company-name"], req.body["email"], req.body["phone-num"], location, req.body["description"]]);
            const hash = crypto.createHash('sha256').update(pass).digest('hex');
            let location = req.body["location-street"] + ", " + req.body["location-city"] + ", " + req.body["location-country"];
            connection.query('INSERT INTO bby12users (username, password, fName, lName, email, phoneNo, location, description) values (?, ?,?,?,?,?,?,?)', [username, hash, req.body["first-name"], req.body["last-name"], req.body["company-name"], req.body["email"], req.body["phone-num"], location, req.body["description"]],
                function(err) {
                    if (err) {
                        reject(new Error("Insert failed"));
                    } else {
                        resolve(true);
                    }
                });
        } else {
            reject(new Error("Username/Password do not match"));
        };
    });
};

function checkUsername(username, req) {
    return (username && username === req.body["username-verify"]); // TODO: Add additional checks: ie. min length
}

function checkPassword(pass, req) {
    return (pass && pass === req.body["password-verify"]); // TODO: Add additional checks: ie. min length
}