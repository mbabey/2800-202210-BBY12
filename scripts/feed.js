'use strict';

module.exports = {
    populateFeed: (homeDOM, con) => {
        console.log("Populating Feed");
        con.query(
            `SELECT users.profilePic, users.cName, users.bType, post.*
            FROM \`BBY_12_post\` AS post
            INNER JOIN \`BBY_12_users\` AS users ON (post.username = users.username)
            ORDER BY post.timestamp DESC;`,
            (error, results, fields) => {
                if (error) throw error;
                results.forEach(async(result) => {

                    let postImages = await getImages(result.username, result.postId, con);
                    let postTags = await getTags(result.username, result.postId, con);
                    console.log(result);

                    postImages.forEach(image => {
                        console.log(image['imgFile']);
                    });

                    postTags.forEach(tag => {
                        console.log(tag['tag']);
                    });

                    // build the post using all data
                    //appendchild to the post block
                });
            });
    }
}

// function retrievePostExtras(username, postId, con) {
//     return new Promise(async(resolve, reject) => {
//         try {
//             let postImages = await getImages(username, postId, con);
//             let postTags = await getTags(username, postId, con);
//             resolve(postImages, postTags);
//         } catch (err) {
//             reject(err);
//         }
//     });
// }

async function getImages(username, postId, con) {
    let imgs;
    await con.promise().query('SELECT imgFile FROM BBY_12_post_img WHERE (`username` = ?) AND (`postId` = ?)', [username, postId])
        .then((results) => {
            imgs = results[0];
            //console.log(results[0]);
        })
        .catch((err) => {
            console.log(err);
        })
    return imgs;
}

async function getTags(username, postId, con) {
    let tags;
    await con.promise().query('SELECT tag FROM BBY_12_post_tag WHERE (`username` = ?) AND (`postId` = ?)', [username, postId])
        .then((results) => {
            tags = results[0];
            //console.log(results[0]);
        }).catch((err) => {
            console.log(err);
        });
    return tags;
}