'use strict';

module.exports = {
  /**
   * getUser. Gets user from DB
   * @param {String} user - user to retrieve.
   * @param {Object} con - the connection to the database.
   * @returns userInfo: Data of user if no issue, undefined otherwise.
   */
  getUser: async (user, con) => {
    let userInfo;
    await con.promise().query('SELECT username, fName, lName, cName, bType, email, phoneNo, location, description, profilePic FROM BBY_12_users WHERE (username = ?);',
      [user]).then((results) => userInfo = results[0])
      .catch((err) => console.log('query-user.js\n', err));
    return userInfo;
  },

  /**
   * getAdmin. Gets admin from DB
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the database.
   * @returns admin: username of admin if no issue, undefined otherwise.
   */
  getAdmin: async (req, con) => {
    let admin;
    await con.promise().query('SELECT * FROM BBY_12_admins WHERE (username = ?);',
      [req.body.username]).then((results) => admin = results[0])
      .catch((err) => console.log(err));
    return admin;
  },

  /**
   * countUser. Gets no. of users from DB
   * @param {Object} con - the connection to the database.
   * @returns count: No. of user if no issue, undefined otherwise.
   */
  countUser: async (con) => {
    let count;
    await con.promise().query('SELECT COUNT(*) AS numUsers FROM BBY_12_users')
      .then((results) => count = results[0]);
    return count;
  },

  /**
   * countAdmin. Gets no. of admins from DB
   * @param {Object} con - the connection to the database.
   * @returns count: No. of admins if no issue, undefined otherwise.
   */
  countAdmin: async (con) => {
    let count;
    await con.promise().query('SELECT COUNT(*) AS numAdmins FROM BBY_12_admins')
      .then((results) => count = results[0]);
    return count;
  },

  /**
   * deleteUser. Delete user from DB
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the database.
   * @returns result: status of query
   */
  deleteUser: async (req, con) => {
    return await con.promise().query('DELETE FROM BBY_12_Users WHERE username = ?', [req.body.username]);
  },

   /**
   * deleteAdmin. Delete admin from DB
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the database.
   * @returns result: status of query
   */
  deleteAdmin: async (req, con) => {
    return await con.promise().query('DELETE FROM BBY_12_Admins WHERE username = ?', [req.body.username]);
  },

  /**
   * insertAdmin. Insert admin into DB
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the database.
   * @returns result: status of query
   */
  insertAdmin: async (req, con) => {
    return await con.promise().query('INSERT INTO BBY_12_admins (username) VALUES (?);', [req.body.username]);
  },

  /**
   * getAllAdmin. Gets list of admins from DB
   * @param {Object} con - the connection to the database.
   * @returns admins: List of admins if no issue, undefined otherwise.
   */
  getAllAdmin: async (con) => {
    let admins;
    await con.promise().query('SELECT * FROM BBY_12_admins')
      .then((results) => {
        admins = results[0];
      });
    return admins;
  },

  /**
   * getAllUser. Gets list of users from DB
   * @param {Object} con - the connection to the database.
   * @returns users: List of users if no issue, undefined otherwise.
   */
  getAllUser: async (con) => {
    let users;
    await con.promise().query('SELECT username, fName, lName, cName, bType, email, phoneNo, location, description, profilePic FROM BBY_12_users')
      .then((results) => {
        users = results[0];
      });
    return users;
  },

  /**
   * updateUser. Updates user info in DB
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the database.
   * @param {boolean} isAdmin - Flag if updater is an admin
   * @returns status: success if no issue, fail otherwise
   */
  updateUser: async (req, con, isAdmin) => {
    let status, username;
    if (isAdmin)
      username = req.body.username;
    else
      username = req.session.username;
    await con.promise().query('UPDATE BBY_12_Users SET cName = ? , fName = ? , lName = ? , bType = ? , email = ? , phoneNo = ? , location = ? , description = ? WHERE username = ?',
      [req.body.cName, req.body.fName, req.body.lName, req.body.bType, req.body.email, req.body.phoneNo, req.body.location, req.body.description, username])
      .then(() => {
        status = "success";
      })
      .catch((err) => {
        status = 'fail';
      });
    return status;
  }
};
