'use strict';

module.exports = {
    getUser: async (user, con) => {
        let userInfo;
        await con.promise().query('SELECT username, fName, lName, cName, bType, email, phoneNo, location, description, profilePic FROM BBY_12_users WHERE (username = ?);',
            [user]).then((results) => userInfo = results[0])
            .catch((err) => console.log(err));
        return userInfo;
    },

    getAdmin: async (req, con) => {
        let admin;
        await con.promise().query('SELECT * FROM BBY_12_admins WHERE (username = ?);',
            [req.body.username]).then((results) => admin = results[0])
            .catch((err) => console.log(err));
        return admin;
    },

    countUser: async (con) => {
        let count;
        await con.promise().query('SELECT COUNT(*) AS numUsers FROM BBY_12_users')
            .then((results) => count = results[0]);
        return count;
    },

    countAdmin: async (con) => {
        let count;
        await con.promise().query('SELECT COUNT(*) AS numAdmins FROM BBY_12_admins')
            .then((results) => count = results[0]);
        return count;
    },

    deleteUser: async (req, con) => {
        return await con.promise().query('DELETE FROM BBY_12_Users WHERE username = ?', [req.body.username]);
    },

    deleteAdmin: async (req, con) => {
        return await con.promise().query('DELETE FROM BBY_12_Admins WHERE username = ?', [req.body.username]);
    },

    insertAdmin: async (req, con) => {
        return await con.promise().query('INSERT INTO BBY_12_admins (username) VALUES (?);', [req.body.username]);
    },

    getAllAdmin: async (con) => {
        let admins;
        await con.promise().query('SELECT * FROM BBY_12_admins')
            .then((results) => {
                admins = results[0];
            });
        return admins;
    },
    getAllUser: async (con) => {
        let users;
        await con.promise().query('SELECT username, fName, lName, cName, bType, email, phoneNo, location, description, profilePic FROM BBY_12_users')
            .then((results) => {
                users = results[0];
            });
        return users;
    },

    updateUser: async (req, con) => {
        let status;
        await con.promise().query('UPDATE BBY_12_Users SET cName = ? , fName = ? , lName = ? , bType = ? , email = ? , phoneNo = ? , location = ? , description = ? WHERE username = ?',
            [req.body.cName, req.body.fName, req.body.lName, req.body.bType, req.body.email, req.body.phoneNo, req.body.location, req.body.description, req.body.username])
            .then((results) => {
                status = "success";
            })
            .catch((err) => {
                status = 'fail';
            });
        return status;
    }

};