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
                    
                    retrievePostExtras(result.username, result.postId, con)
                        .then((extras) => {

                        });
                    // build the post using all data
                    //appendchild to the post block
                }); {

                }
            });
    }
}

function retrievePostExtras(username, postId, con) {
    return new Promise(async (resolve, reject) => {
        try {
            let postImages = await getImages(username, postId, con);
            let postTags = await getTags(username, postId, con);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
}

async function getImages(username, postId, con) {
    await con.promise().query(
        `SELECT * 
        FROM \`BBY_12_post_img\`
        WHERE username = '${username}' AND postId = '${postId}'`)
        .then((error, results, fields) => {
            if (error) throw error;

            return results;
        }).catch((err) => {
        });
}

async function getTags(username, postId, con) {
    await con.promise().query(
        `SELECT * 
        FROM \`BBY_12_post_tag\`
        WHERE username = '${username}' AND postId = '${postId}'`)
        .then((error, results, fields) => {
            if (error) throw error;
            
            return results;
        }).catch((err) => {
        });
}
