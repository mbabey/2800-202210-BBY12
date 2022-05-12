'use strict';

module.exports = {
    populateFeed: (homeDOM, con) => {
        con.query(
            `SELECT users.profilePic, users.cName, post.*
            FROM \`BBY_12_post\` AS post
            INNER JOIN \`BBY_12_users\` AS users ON (post.username = users.username)
            ORDER BY post.timestamp DESC;`,
            (error, results, fields) => {
                if (error) throw error;
                results.forEach((result) => {
                    // get an array of images in the post
                    let postImages = getImages(result.username, result.postId, con);
                    // get an array of tags in the post
                    let postTags = getTags(result.username, result.postId, con);
                    // build the post using all data
                    //appendchild to the post block
                }); {

                }
            });
    }
}

function getImages(username, postId, con) {
    con.query(
        `SELECT * 
        FROM \`BBY_12_post_img\`
        WHERE username = '${username}' AND postId = '${postId}'`,
        (error, results, fields) => {
            if (error) throw error;
            console.log(results);
            return results;
        });
}

function getTags(username, postId, con) {
    con.query(
        `SELECT * 
        FROM \`BBY_12_post_tag\`
        WHERE username = '${username}' AND postId = '${postId}'`,
        (error, results, fields) => {
            if (error) throw error;
            console.log(results);
            return results;
        });
}
