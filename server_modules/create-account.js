'use strict';
const crypto = require('crypto');

module.exports = {
  createAccount: async function (req, res, con) {
    res.setHeader('Content-Type', 'application/json');
    let success = await insertDBNewUser(req, con);
    return success;
  },

  createAdmin: async function (req, res, con) {
    res.setHeader('Content-Type', 'application/json');
    let success = insertDBAdmin(req, con);
    await success
      .then(() => {
        insertAdmin(req.body.username, con)
          .then()
          .catch((err) => { });
      }).catch((err) => { });
    return success;
  }
};

function insertDBNewUser(req, connection) {
  return new Promise((resolve, reject) => {
    const username = req.body.username.trim();
    const pass = req.body.password;
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    connection.query(
      'INSERT INTO BBY_12_users (username, password, email, profilePic) VALUES (?, ?, ?, ?);',
      [username, hash, req.body.email, 'logo.png'],
      (err) => {
        if (err)
          reject(err);
        else
          resolve(true);
      });
  });
}

function insertDBAdmin(req, connection) {
  return new Promise((resolve, reject) => {
    const username = req.body.username.trim();
    const pass = req.body.password;
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    const location = concatenateLocation(req.body["location-street"], req.body["location-city"], req.body["location-country"])
    connection.query(
      'INSERT INTO BBY_12_users (username, password, fName, lName, cName, bType, email, phoneNo, location, description) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, hash, req.body["first-name"], req.body["last-name"], req.body["company-name"], req.body["company-type"], req.body.email, req.body["phone-num"], location, req.body.description],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
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
