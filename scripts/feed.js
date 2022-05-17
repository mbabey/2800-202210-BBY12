'use strict';

module.exports = {
    populateFeed: async (req, homeDOM, templateDOM, con) => {
        return new Promise(async (resolve, reject) => {
            console.log("Populating Feed");
            let posts;
            await con.promise().query(
                `SELECT users.profilePic, users.cName, users.bType, users.username, post.*
                FROM \`BBY_12_post\` AS post
                INNER JOIN \`BBY_12_users\` AS users ON (post.username = users.username)
                ORDER BY post.timestamp DESC;`)
                .then((results) => {
                    posts = results[0];
                })
                .catch((err) => {
                    reject(err);
                });
            homeDOM = await populatePosts(req, homeDOM, templateDOM, posts, con);
            resolve(homeDOM);
        });

    }
};

// build the post using all data
//appendchild to the post block
async function populatePosts(req, homeDOM,templateDOM, posts, con) {
    let doc = homeDOM.window.document;
    let postTemp = templateDOM.window.document;
    let pBody = doc.querySelector(".post-block");
    let pTemplateContent = postTemp.getElementById("post-template").content;
    let pImgTemplateContent = postTemp.getElementById("image-template").content;
    let pTagTemplateContent = postTemp.getElementById("tag-template").content;
    let pEditTemplateContent = postTemp.getElementById("edit-template").content;

    for (const post of posts) {
        let postImages = await getImages(post.username, post.postId, con);
        let postTags = await getTags(post.username, post.postId, con);

        let clone = pTemplateContent.cloneNode(true);
        clone.querySelector("#post-user-avatar").src = "./avatars/" + post.profilePic;
        clone.querySelector("#post-business-name").textContent = post.cName;
        clone.querySelector("#post-business-type").textContent = post.bType;
        clone.querySelector("#post-timestamp").textContent = post.timestamp.toDateString().split(' ').slice(1).join(' ');
        clone.querySelector("#post-description").textContent = post.content;
        clone.querySelector("#post-title").textContent = post.postTitle;

        let pImgs = clone.querySelector(".post-images");
        let pTags = clone.querySelector(".post-tags");
        for (const image of postImages) {
            if (image) {
                let img = pImgTemplateContent.cloneNode(true);
                img.querySelector("img").src = "./images/" + image["imgFile"];
                img.querySelector("img").alt = image["imgFile"];
                pImgs.appendChild(img);
            }
        }

        for (const tags of postTags) {
            if (tags) {
                let tag = pTagTemplateContent.cloneNode(true);
                tag.querySelector("a").textContent = tags["tag"];
                tag.querySelector("a").href = tags["tag"];
                pTags.appendChild(tag);
            }
        }

        if (req.session.username == post.username) {
            let pEdit = pEditTemplateContent.firstElementChild.cloneNode(true);
            //console.log(clone.lastElementChild);
            //pEdit.addEventListener("click", function(){alert("click");});
            clone.querySelector("#post-footer").appendChild(pEdit)
        };

        pBody.appendChild(clone);
    }
    return homeDOM;
}

async function getImages(username, postId, con) {
    let imgs;
    await con.promise().query('SELECT imgFile FROM BBY_12_post_img WHERE (`username` = ?) AND (`postId` = ?)', [username, postId])
        .then((results) => {
            imgs = results[0];
        })
        .catch((err) => {
            console.log(err);
        });
    return imgs;
}

async function getTags(username, postId, con) {
    let tags;
    await con.promise().query('SELECT tag FROM BBY_12_post_tag WHERE (`username` = ?) AND (`postId` = ?)', [username, postId])
        .then((results) => {
            tags = results[0];
        }).catch((err) => {
            console.log(err);
        });
    return tags;
}