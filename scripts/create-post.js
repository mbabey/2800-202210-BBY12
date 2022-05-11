'use strict';
const mysql = require('mysql2/promise');
const { render } = require('express/lib/response');
const { JSDOM } = require('jsdom');
//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

module.exports = {
    createPost: async function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        let con = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'COMP2800'
        });
        // con.connect();
        let success = await insertDB(req, con);
        con.end();
        return success;
    }
};

async function insertDB(req, con) {
    const [rows, fields] = await con.execute('SELECT MAX(postId) AS maxId FROM bby_12_post');
    let postId = rows[0].maxId + 1;
    return new Promise(async(resolve, reject) => {
        if (req.body["input-title"] && (req.body["input-description"])) {
            await con.execute('INSERT INTO \`BBY_12_Post\` (username, postId, postTitle, timestamp, content) values (?,?,?,?,?)', [req.session.username, postId, req.body["input-title"], new Date().toISOString().slice(0, 19).replace('T', ' '), req.body["input-description"]],
                function(err) {
                    console.log(err);
                });
            if (req.files) {
                console.log("TIME TO UPLOAD IMAGES NERD");
            }
            resolve(true);
        } else {
            reject(new Error("Title and description required"));
        }
    });
}