'use strict';

module.exports = {
    deleteTags: async (req, con) => {
        return new Promise(async (resolve, reject) => {
            await con.promise().query('DELETE FROM BBY_12_POST_Tag WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });
        });

    },
    deleteImgs: async (req, con) => {
        return new Promise(async (resolve, reject) => {
            await con.promise().query('DELETE FROM BBY_12_POST_Img WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    
    },
    deletePost: async (req, con) => {
        return new Promise(async (resolve, reject) => {
            await con.promise().query('DELETE FROM BBY_12_POST WHERE (username = ?) AND (postId = ?)', [req.body.username, req.body.postId])
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    
    }
};