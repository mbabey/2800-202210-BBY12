'use strict';

module.exports = {
  /**
   * deleteTags. Deletes tags from the database. 
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the server.
   */
  deleteTags: async (req, con) => {
    await con.promise().query('DELETE FROM BBY_12_POST_Tag WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
      .catch((err) => console.log(err));
  },

  /**
   * deleteImgs. Deletes images from the database.
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the server.
   */
  deleteImgs: async (req, con) => {
    await con.promise().query('DELETE FROM BBY_12_POST_Img WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
      .catch((err) => console.log(err));
  },

  /**
   * deletePost. Deletes a post from the database.
   * @param {Object} req - the request from the client.
   * @param {Object} con - the connection to the server.
   */
  deletePost: async (req, con) => {
    await con.promise().query('DELETE FROM BBY_12_POST WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
      .catch((err) => console.log(err));

  }
};
