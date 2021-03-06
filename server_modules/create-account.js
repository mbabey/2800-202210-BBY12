'use strict';
const crypto = require('crypto');

module.exports = {
  /**
   * createAccount. Inserts a new account into the DB with all information
   * @param {Object} req - the request from the client
   * @param {Object} res - the response from the server
   * @param {Object} con - the connection to the database
   * @returns success - the promise returned by the insert query
   */
  createAccount: async function (req, res, con) {
    let success = await insertDBNewUser(req, con);
    await success;
    return success;
  },

  /**
   * adminCreateAccount. Inserts a new user account into the DB with all information.
   * @param {Object} req - the request from the client.
   * @param {Object} res - the response from the server.
   * @param {Object} con - the connection to the database
   * @returns success - the promise returned by the insert query
   */
  adminCreateAccount: async function (req, res, con) {
    let success = insertDBAdmin(req, con);
    await success;
    return success;
  },

  /**
   * adminCreateAccount. Inserts a new admin account into the DB with all information.
   * @param {Object} req - the request from the client.
   * @param {Object} res - the response from the server.
   * @param {Object} con - the connection to the database
   * @returns success - the promise returned by the insert query
   */
  adminCreateAdmin: async function (req, res, con) {
    let success = insertDBAdmin(req, con);
    await success
      .then(() => {
        insertAdmin(req.body.username, con).catch((err) => { });
      }).catch((err) => { });
    return success;
  }
};

/**
 * insertDBNewUser. Inserts a new user account into the DB with all information.
 * @param {Object} req - the request from the client.
 * @param {Object} con - the connection to the database.
 * @returns promise: resolved if no issue, reject otherwise.
 */
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

/**
 * inserDBAdmin. Inserts a new user into the database with all information.
 * @param {Object} req - the request from the client.
 * @param {Object} con - the connection to the database
 * @returns promise: resolved if no issue, reject otherwise.
 */
function insertDBAdmin(req, connection) {
  return new Promise((resolve, reject) => {
    const username = req.body.username.trim();
    const pass = req.body.password;
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    const location = concatenateLocation(req.body.locationStreet, req.body.locationCity, req.body.locationCountry);
    connection.query(
      'INSERT INTO BBY_12_users (username, password, fName, lName, cName, bType, email, phoneNo, location, description) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, hash, req.body.fName, req.body.lName, req.body.cName, req.body.bType, req.body.email, req.body.phoneNo, location, req.body.description],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
  });
}

/**
 * insertAdmin. Adds a username to the admin table.
 * @param {String} username - the username to add
 * @param {Object} con - the connection to the database
 * @returns promise: resolved if no issue, reject otherwise.
 */
function insertAdmin(username, connection) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO BBY_12_admins VALUES (?)', [username],
      function (err) {
        if (err) {
          reject(new Error("Admin Insert failed"));
        } else {
          resolve(true);
        }
      });
  });
}

/**
 * concatenateLocation. Conditionally concatenates the three location parameters into one String.
 * @param {String} street - Street of location
 * @param {String} city - City of location
 * @param {String} country - Country of location
 */
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
