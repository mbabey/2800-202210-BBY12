'use strict';

module.exports = {
    populateFeed: async (homeDOM, con) => {
        console.log("Populating Feed");
        let posts;
        await con.promise().query(
            `SELECT users.profilePic, users.cName, users.bType, post.*
            FROM \`BBY_12_post\` AS post
            INNER JOIN \`BBY_12_users\` AS users ON (post.username = users.username)
            ORDER BY post.timestamp DESC;`)
            .then((results) => {
                //results.forEach(async (result) => {
                posts = results[0];
                //console.log(posts);
            })
            .catch((err) => {
                console.log(err);
            });

        // build the post using all data
        //appendchild to the post block
        let doc = homeDOM.window.document;
        let pBody = doc.querySelector(".post-block");
        let pTemplateContent = doc.getElementById("post-template").content;


        let pImgTemplateContent = doc.getElementById("image-template").content;
        let pTagTemplateContent = doc.getElementById("tag-template").content;


        for (const post of posts) {
            let postImages = await getImages(post.username, post.postId, con);
            let postTags = await getTags(post.username, post.postId, con);

            let clone = pTemplateContent.cloneNode(true);
            clone.querySelector("#post-user-avatar").src = "./avatars/" + post.profilePic;
            clone.querySelector("#post-business-name").textContent = post.cName;
            clone.querySelector("#post-business-type").textContent = post.bType;
            clone.querySelector("#post-timestamp").textContent = post.timestamp;
            clone.querySelector("#post-description").textContent = post.content;
            clone.querySelector("#post-title").textContent = post.postTitle;
            console.log(post.postId, postImages, postTags);


            let pImgs = clone.querySelector(".post-images");
            let pTags = clone.querySelector(".post-tags");
            for (const image of postImages) {
                if (image) {
                    let img = pImgTemplateContent.cloneNode(true);
                    img.querySelector("img").src = "./images/" + image["imgFile"];
                    pImgs.appendChild(img);
                    console.log(image["imgFile"]);
                }

            }
            for (const tags of postTags) {
                if (tags) {
                    let tag = pTagTemplateContent.cloneNode(true);
                    tag.querySelector("a").textContent = tags["tag"];
                    tag.querySelector("a").href = tags["tag"];
                    pTags.appendChild(tag);
                }
                console.log(tags["tag"]);
            }

            pBody.appendChild(clone);
        }
        return homeDOM;
    }
};

// function retrievePostExtras(username, postId, con) {
//     return new Promise(async (resolve, reject) => {
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
            reject(err);
        });
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