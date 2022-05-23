'use strict';
const crypto = require('crypto');
const { Resolver } = require('dns');

module.exports = {
    resetPassword: async function(req, res, con) {
        res.setHeader('Content-Type', 'application/json');
        let success = await insertDB(req, con);
        return success;
    }
};

function insertDB(req, connection) {
    return new Promise((resolve, reject) => {
        let username = req.body.username;
        let pass = crypto.createHash('sha256').update(req.body["current-password"]).digest('hex');
        let newPass = req.body.password

        checkAccount(username, pass, connection)
            .then(() => {
                if (checkNewPassword(newPass, req)) {
                    let hash = crypto.createHash('sha256').update(newPass).digest('hex');
                    connection.query('UPDATE BBY_12_users SET password = ? WHERE username = ?', [hash, username],
                        (err) => {
                            if (err) {
                                reject(new Error("Password Update failed"));
                            } else {
                                resolve(true);
                            }
                        });
                }
            })
            .catch((err) => {
                reject(err);
            });

    });
};

function checkAccount(username, pass, connection) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM BBY_12_users WHERE (`username` = ?) AND (`password` = ?);', [username, pass], (err, results) => {
            if (err) {
                reject(new Error("Account search failed"))
            } else if (results && results.length > 0) {
                resolve(true);
            } else {
                reject(new Error("Username/Password do not match"))
            }
        });
    });
}

function checkNewPassword(pass, req) {
    return (pass && pass === req.body["password-verify"]); // TODO: Add additional checks: ie. min length
}