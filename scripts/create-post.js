'use strict';
const mysql = require('mysql2/promise');
const { render } = require('express/lib/response');
const { JSDOM } = require('jsdom');
//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

module.exports = {
    createPost: async function(req, res, storage) {
        res.setHeader('Content-Type', 'application/json');
        let con = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'COMP2800'
        });
        // con.connect();
        let success = await insertDB(req, con, storage);
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
            if (req.files.length > 0) {
                console.log(req.files);
                console.log("TIME TO UPLOAD IMAGES NERD");
                req.files.forEach(async image => {
                    //console.log(req.session.username, postId, image.originalname);
                    await con.execute('INSERT INTO \`BBY_12_Post_Img\` (username, postId, imgFile) values (?,?,?)', [req.session.username, postId, image.originalname],
                        function(err) {
                            console.log(err);
                        });
                });
            }
            let tags = req.body["tag-field"].split(/[\s#]/)
            tags = tags.filter(function(item, pos) {
                return tags.indexOf(item) == pos;
            });
            console.log(tags);
            tags.forEach(async tag => {
                if (tag) {
                    await con.execute('INSERT INTO \`BBY_12_Post_Tag\`(username, postId, tag) values (?,?,?)', [req.session.username, postId, tag],
                        function(err) {
                            console.log(err);
                        });
                }
            });
            resolve(true);
        } else {
            reject(new Error("Title and description required"));
        }
    });
}