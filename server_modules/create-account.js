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
        let username = req.body.username.trim();
        let pass = req.body.password;
        console.log(req.body);
        if (checkUsername(username, req) && checkPassword(pass, req)) {
            const hash = crypto.createHash('sha256').update(pass).digest('hex');
            let location = concatenateLocation(req.body["location-street"].trim(), req.body["location-city"].trim(), req.body["location-country"].trim());
            connection.query(
                'INSERT INTO BBY_12_users (username, password, fName, lName, cName, bType, email, phoneNo, location, description) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [username, hash, req.body["first-name"].trim(), req.body["last-name"].trim(), req.body["company-name"].trim(), req.body['company-type'].trim(), req.body["email"].trim(), req.body["phone-num"].trim(), location, req.body.description.trim()],
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

function concatenateLocation(street, city, country) {
  let location = '';
  if (street != '') {
    location += street;
    if (city != '') {
      location += ', ' + city;
    }
    if (country != '') {
      location += ', ' + country;
    }
  } else if (city != '') {
    location += city;
    if (country != '') {
      location += ', ' + country;
    }
  } else if (country != '') {
    location += country;
  }
  return location;
}
