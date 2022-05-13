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
          .catch((err) => {});
      }).catch((err) => {});
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