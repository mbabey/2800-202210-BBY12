'use strict';
const crypto = require('crypto');

module.exports = {
  /**
   * login. Checks the req parameters against the database and logs in the user.
   * @param {Object} req - the request from the client.
   * @param {String} user - the username coming from the client.
   * @param {String} pass - the password coming from the client.
   * @param {Object} con - the connection to the server.
   * @returns json: status of the response, and the req object.
   */
  login: async (req, user, pass, con) => {
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    let status;
    await con.promise().query('SELECT * FROM BBY_12_users WHERE (`username` = ?) AND (`password` = ?);', [user, hash])
      .then((results) => {
        if (results[0] && results[0].length > 0) {
          login(req, user, con);
          status = 'success';
        } else if (user == 'ping' && pass == 'pong') {
          status = 'egg';
        } else {
          status = 'fail';
        }
      }).catch((err) => {
        status = 'fail';
      });
    return { status: status, request: req };
  }
};

/**
 * login. Sets the user's session to logged in. Queries the admin table; 
 * if the user is an admin, sets the user's session to an admin session. 
 * @param {Object} req - the request from the client.
 * @param {String} user - the username coming from the client.
 * @param {Object} con - the connection to the database.
 */
function login(req, user, con) {
  req.session.loggedIn = true;
  req.session.username = user;
  req.session.admin = false;
  con.query('Select * from (`BBY_12_admins`) Where (`username` = ?)', [user], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.admin = true;
    }
    req.session.save();
  });
};
