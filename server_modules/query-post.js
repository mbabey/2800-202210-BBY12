'use strict';

module.exports = {
  /**
   * updatePost. Update post content in DB.
   * @param {Object} req - Query to send to DB.
   * @param {Object} con - the connection to the database.
   */
  updatePost: async (req, con) => {
    await con.promise().query('UPDATE BBY_12_POST SET postTitle = ?, content = ? WHERE (username = ?) AND (postId = ?)',
      [req.body["input-title"], req.body["input-description"], req.body.username, req.body.postId])
      .catch((error) => {
        console.log(error);
      });
  },

  /**
   * updateTags. Insert tags into DB.
   * @param {Object} req - Query to send to DB.
   * @param {Object} con - the connection to the database.
   */
  updateTags: async (req, con) => {
    //Add Updated Tags from Post
    let tags = req.body["tag-field"].split(/[\s#]/);
    tags = tags.filter((item, pos) => {
      return tags.indexOf(item) == pos;
    });
    tags.forEach(async tag => {
      if (tag) {
        await con.promise().query('INSERT INTO BBY_12_Post_Tag (username, postId, tag) values (?,?,?)', [req.body.username, req.body.postId, tag])
          .catch((err) => {
            console.log(err);
          });
      }
    });
  },

  /**
   * deleteImgs. Delete image paths into DB.
   * @param {Object} req - Query to send to DB.
   * @param {Object} con - the connection to the database.
   */
  deleteImgs: async (req, con) => {
    let imgDelete = [].concat(req.body["image-delete"]);
    imgDelete.forEach(async img => {
      await con.promise().query('DELETE FROM BBY_12_POST_Img WHERE (username = ?) AND (postId = ?) AND (imgFile = ?)', [req.body.username, req.body.postId, img])
        .catch((err) => {
          console.log(err);
        });
    });
  },

  /**
   * updateImgs. Insert image paths into DB.
   * @param {Object} req - Query to send to DB.
   * @param {Object} con - the connection to the database.
   */
  updateImgs: async (req, con) => {
    if (req.files.length > 0) {
      req.files.forEach(async image => {
        await con.promise().query('INSERT INTO BBY_12_Post_Img (username, postId, imgFile) values (?,?,?)', [req.body.username, req.body.postId, image.filename])
          .catch((err) => {
            console.log(err);
          });
      });
    }
  },

  /**
   * getPost. Retrieve post content from DB.
   * @param {Object} req - Query to send to DB.
   * @param {Object} con - the connection to the database.
   * @returns postContent: Post content associated with post if no issue, undefined otherwise
   */
  getPost: async (req, con) => {
    let postContent;
    await con.promise().query('SELECT * FROM `BBY_12_POST` WHERE (username = ?) AND (postId = ?)', [req.params.username, req.params.postId])
      .then((results) => {
        postContent = results[0];
      }).catch((err) => console.log(err));
    return postContent;
  },

  /**
   * getImgs. Retrieve list of images from DB.
   * @param {Object} req - Query to send to DB.
   * @param {Object} con - the connection to the database.
   * @returns postImgs: Images associated with post if no issue, undefined otherwise
   */
  getImgs: async (req, con) => {
    let postImgs;
    await con.promise().query('SELECT imgFile FROM BBY_12_post_img WHERE (`username` = ?) AND (`postId` = ?)', [req.params.username, req.params.postId])
      .then((results) => postImgs = results[0])
      .catch((err) => console.log(err));
    return postImgs;
  },
  
  /**
   * getTags. Retrieve list of tags from DB.
   * @param {Object} req - Query to send to DB.
   * @param {Object} con - the connection to the database.
   * @returns postTags: Tags associated with post if no issue, undefined otherwise
   */
  getTags: async (req, con) => {
    let postTags;
    await con.promise().query('SELECT tag FROM BBY_12_post_tag WHERE (`username` = ?) AND (`postId` = ?)', [req.params.username, req.params.postId])
      .then((results) => postTags = results[0])
      .catch((err) => console.log(err));
    return postTags;
  }
};
