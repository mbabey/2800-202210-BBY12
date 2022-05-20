'use strict';
const crypto = require('crypto');

module.exports = {
    createAccount: async function (req, res, con) {
        res.setHeader('Content-Type', 'application/json');
        let success = await insertDB(req, con);
        return success;
    },

    createAdmin: async function (req, res, con) {
        res.setHeader('Content-Type', 'application/json');
        let success = insertDB(req, con);
        await success
            .then((result) => {
                insertAdmin(req.body.username, con)
                    .then()
                    .catch((err) => { });
            }).catch((err) => { });
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
            connection.query(
                'INSERT INTO BBY_12_users (username, password, fName, lName, cName, email, phoneNo, location, description) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [username, hash, req.body["first-name"], req.body["last-name"], req.body["company-name"], req.body["email"], req.body["phone-num"], location, req.body.description],
                (err) => {
                    if (err) {
                        reject(err);
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
        connection.query('INSERT INTO BBY_12_admins values(?)', [username],
            function (err) {
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

document.querySelectorAll('#visibility-p').addEventListener("click", (event) => {
    document.querySelector('#password').setAttribute("type", "text");
    // document.querySelector('#password-verify').setAttribute("type", "text");
    document.querySelectorAll('#visi-off-p').removeChild(document.querySelector('path'));
    document.querySelectorAll('#visi-off-p').remove();

    let eye_on = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -30 100 100" height="48" width="48"><path d="M24 31.5Q27.55 31.5 30.025 29.025Q32.5 26.55 32.5 23Q32.5 19.45 30.025 16.975Q27.55 14.5 24 14.5Q20.45 14.5 17.975 16.975Q15.5 19.45 15.5 23Q15.5 26.55 17.975 29.025Q20.45 31.5 24 31.5ZM24 28.6Q21.65 28.6 20.025 26.975Q18.4 25.35 18.4 23Q18.4 20.65 20.025 19.025Q21.65 17.4 24 17.4Q26.35 17.4 27.975 19.025Q29.6 20.65 29.6 23Q29.6 25.35 27.975 26.975Q26.35 28.6 24 28.6ZM24 38Q16.7 38 10.8 33.85Q4.9 29.7 2 23Q4.9 16.3 10.8 12.15Q16.7 8 24 8Q31.3 8 37.2 12.15Q43.1 16.3 46 23Q43.1 29.7 37.2 33.85Q31.3 38 24 38ZM24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23ZM24 35Q30.05 35 35.125 31.725Q40.2 28.45 42.85 23Q40.2 17.55 35.125 14.275Q30.05 11 24 11Q17.95 11 12.875 14.275Q7.8 17.55 5.1 23Q7.8 28.45 12.875 31.725Q17.95 35 24 35Z"/></svg>'
    document.querySelector('#visibility-p').appendChild(eye_on);
});