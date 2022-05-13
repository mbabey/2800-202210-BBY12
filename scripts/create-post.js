'use strict';

module.exports = {
  createPost: async (req, res, storage, con) => {
    res.setHeader('Content-Type', 'application/json');
    let success = await insertDB(req, con, storage);
    return success;
  }
};

async function insertDB(req, con) {
  const [rows, fields] = await con.execute('SELECT MAX(postId) AS maxId FROM bby_12_post');
  let postId = rows[0].maxId + 1;
  return new Promise(async (resolve, reject) => {
    if (req.body["input-title"] && (req.body["input-description"])) {
      await con.execute('INSERT INTO \`BBY_12_Post\` (username, postId, postTitle, timestamp, content) values (?,?,?,?,?)', [req.session.username, postId, req.body["input-title"], new Date().toISOString().slice(0, 19).replace('T', ' '), req.body["input-description"]],
        (err) => {
          if (err) throw err;
        });
      if (req.files.length > 0) {
        req.files.forEach(async image => {
          await con.execute('INSERT INTO \`BBY_12_Post_Img\` (username, postId, imgFile) values (?,?,?)', [req.session.username, postId, image.originalname],
            (err) => {
              if (err) throw err;
            });
        });
      }
      let tags = req.body["tag-field"].split(/[\s#]/)
      tags = tags.filter((item, pos) => {
        return tags.indexOf(item) == pos;
      });
      tags.forEach(async tag => {
        if (tag) {
          await con.execute('INSERT INTO \`BBY_12_Post_Tag\`(username, postId, tag) values (?,?,?)', [req.session.username, postId, tag],
            (err) => {
              if (err) throw err;
            });
        }
      });
      resolve(true);
    } else {
      reject(new Error("Title and description required"));
    }
  });
}