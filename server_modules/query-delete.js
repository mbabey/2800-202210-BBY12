'use strict';

module.exports = {
  deleteTags: async (req, con) => {
    await con.promise().query('DELETE FROM BBY_12_POST_Tag WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
      .catch((err) => console.log(err));
  },

  deleteImgs: async (req, con) => {
    await con.promise().query('DELETE FROM BBY_12_POST_Img WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
      .catch((err) => console.log(err));
  },

  deletePost: async (req, con) => {
    await con.promise().query('DELETE FROM BBY_12_POST WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
      .catch((err) => console.log(err));

  }
};
