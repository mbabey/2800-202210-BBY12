'use strict';

module.exports = {
    updatePost: async (req, con) => {
        await con.promise().query('UPDATE BBY_12_POST SET postTitle = ?, content = ? WHERE (username = ?) AND (postId = ?)',
            [req.body["input-title"], req.body["input-description"], req.body.username, req.body.postId])
            .catch((error) => {
                console.log(error);
            });
    },

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

    deleteImgs: async (req, con) => {
        let imgDelete = [].concat(req.body["image-delete"]);
        imgDelete.forEach(async img => {
            await con.promise().query('DELETE FROM BBY_12_POST_Img WHERE (username = ?) AND (postId = ?) AND (imgFile = ?)', [req.body.username, req.body.postId, img])
                .catch((err) => {
                    console.log(err);
                });
        });
    },

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

    getPost: async (req, con) => {
        let postContent;
        await con.promise().query('SELECT * FROM `BBY_12_POST` WHERE (username = ?) AND (postId = ?)', [req.params.username, req.params.postId])
            .then((results) => {
                postContent = results[0];
            }).catch((err) => console.log(err));
        return postContent;
    },

    getImgs: async (req, con) => {
        let postImgs;
        await con.promise().query('SELECT imgFile FROM BBY_12_post_img WHERE (`username` = ?) AND (`postId` = ?)', [req.params.username, req.params.postId])
            .then((results) => postImgs = results[0])
            .catch((err) => console.log(err));
        return postImgs;
    },
    getTags: async (req, con) => {
        let postTags;
        await con.promise().query('SELECT tag FROM BBY_12_post_tag WHERE (`username` = ?) AND (`postId` = ?)', [req.params.username, req.params.postId])
            .then((results) => postTags = results[0])
            .catch((err) => console.log(err));
        return postTags;
    },

};