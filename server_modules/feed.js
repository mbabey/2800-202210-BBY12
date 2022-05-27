'use strict';

module.exports = {
  /**
   * populateFeed. Fills the homeDOM with posts built on templateDOM queried from the database.
   * @param {Object} req - the request from the client.
   * @param {DOM} homeDOM - the page to populate with posts.
   * @param {DOM} templateDOM - the template to be used for posts.
   * @param {Object} con - the connection to the server.
   * @returns promise: resolve if no problem, reject otherwise.
   */
  populateFeed: async (req, homeDOM, templateDOM, con) => {
    return new Promise(async (resolve, reject) => {
      let posts;
      await con.promise().query(
        'SELECT users.profilePic, users.cName, users.bType, post.* FROM BBY_12_post AS post INNER JOIN BBY_12_users AS users ON (post.username = users.username) ORDER BY post.timestamp DESC;')
        .then((results) => {
          posts = results[0];
        })
        .catch((err) => {
          reject(err);
        });
      homeDOM = await populatePosts(req, homeDOM, templateDOM, posts, con);
      resolve(homeDOM);
    });
  },

  /**
   * populateProfileFeed. Fills the profileDOM with posts built on templateDOM queried from the database. Only looks for the current user's posts.
   * @param {Object} req - the request from the client.
   * @param {DOM} profileDOM - the page to populate with posts.
   * @param {DOM} templateDOM - the template to be used for posts.
   * @param {Object} con - the connection to the server.
   * @returns promise: resolve if no problem, reject otherwise.
   */
  populateProfileFeed: async (req, profileDOM, templateDOM, con) => {
    return new Promise(async (resolve, reject) => {
      let posts;
      await con.promise().query(
        'SELECT users.profilePic, users.cName, users.bType, post.* FROM BBY_12_post AS post INNER JOIN BBY_12_users AS users ON (post.username = users.username) WHERE post.username = ? ORDER BY post.timestamp DESC;',
        [req.session.username])
        .then((results) => {
          posts = results[0];
        })
        .catch((err) => {
          reject(err);
        });
      profileDOM = await populatePosts(req, profileDOM, templateDOM, posts, con);
      resolve(profileDOM);
    });
  }

};

// build the post using all data
//appendchild to the post block
/**
 * populatePosts. Builds the posts using data from the database and appends the posts to the post block.
 * @param {Object} req - the request from the client.
 * @param {DOM} homeDOM - the page to populate with posts.
 * @param {DOM} templateDOM - the template to be used for posts.
 * @param {Object} posts - the variable holding all the posts.
 * @param {Object} con - the connection to the server.
 * @returns the homeDOM with posts attached.
 */
async function populatePosts(req, homeDOM, templateDOM, posts, con) {
  let doc = homeDOM.window.document;
  let postTemp = templateDOM.window.document;
  let pBody = doc.querySelector(".post-block");
  let pTemplateContent = postTemp.getElementById("post-template").content;
  let pImgTemplateContent = postTemp.getElementById("image-template").content;
  let pTagTemplateContent = postTemp.getElementById("tag-template").content;
  let pEditTemplateContent = postTemp.getElementById("edit-template").content;
  let pAddImgTemplateContent = postTemp.getElementById("add-image-template").content;

  for (const post of posts) {
    let clone = await makePostBody(pTemplateContent, post);
    let pImgs = clone.querySelector(".gallery");
    let pTags = clone.querySelector(".post-tags");
    let postImages = await getImages(post.username, post.postId, con);
    let postTags = await getTags(post.username, post.postId, con);
    await renderImgs(postImages, pImgs, pImgTemplateContent);
    await renderTags(postTags, pTags, pTagTemplateContent);

    let pAddImgs = pAddImgTemplateContent.cloneNode(true);
    pImgs.parentNode.appendChild(pAddImgs);

    if (req.session.username == post.username) {
      let pEdit = pEditTemplateContent.cloneNode(true);
      clone.querySelector("#post-footer").appendChild(pEdit);
    }
    pBody.appendChild(clone);
  }
  return homeDOM;
}

/**
 * makePostBody. Place upon the post all of the data queried formt he server.
 * @param {DOM element} pTemplateContent - the post template HTML.
 * @param {Object} post - the post information
 * @returns clone - the HTML of the post.
 */
async function makePostBody(pTemplateContent, post) {
  let clone = pTemplateContent.cloneNode(true);
  clone.querySelector("#post").dataset.postId = post.postId;
  clone.querySelector("#post").dataset.username = post.username;
  clone.querySelector("#post-user-avatar").src = "./avatars/" + post.profilePic;
  clone.querySelector("#post-business-name").textContent = post.cName;
  clone.querySelector("#post-business-type").textContent = post.bType;
  clone.querySelector("#post-timestamp").textContent = post.timestamp.toDateString().split(' ').slice(1).join(' ');
  clone.querySelector("#post-description").textContent = post.content;
  clone.querySelector("#post-title").textContent = post.postTitle;
  clone.querySelector("#link-avatar").href = "/users?" + new URLSearchParams({ "user": post.username });
  clone.querySelector("#link-bName").href = "/users?" + new URLSearchParams({ "user": post.username });
  return clone;
}

/**
 * renderImages. Adds all images to a post image container.
 * @param {Object} postImages - the post image information
 * @param {DOM element} pImgs - the image container on the post DOM
 * @param {DOM element} pImgTemplateContent - the template for post images.
 */
async function renderImgs(postImages, pImgs, pImgTemplateContent) {
  for (const image of postImages) {
    if (image) {
      let img = pImgTemplateContent.cloneNode(true);
      img.querySelector("img").src = "./images/" + image.imgFile;
      img.querySelector("img").alt = image.imgFile;
      pImgs.appendChild(img);
    }
  }
}

/**
 * renderTags. Adds all images to a post tag container
 * @param {Object} postTags - the post tag information.
 * @param {DOM element} pTags - the tag container on the post DOM
 * @param {DOM element} pTagTemplateContent - the template for post tags.
 */
async function renderTags(postTags, pTags, pTagTemplateContent) {
  for (const tags of postTags) {
    if (tags) {
      let tag = pTagTemplateContent.cloneNode(true);
      tag.querySelector("a").textContent = '#' + tags.tag;
      tag.querySelector("a").href = '#' + tags.tag;
      pTags.appendChild(tag);
    }
  }
}

/**
 * getImages. Gets all the image from the database with matching username and postId.
 * @param {String} username - the username to be queried against
 * @param {int} postId - the postId to be queried against
 * @param {Object} con - the connection to the database.
 * @returns the images queried from the database.
 */
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

/**
 * getTags. Gets all the tags from the database with matching username and postId.
 * @param {String} username - the username to be queried against
 * @param {int} postId - the postId to be queried against
 * @param {Object} con - the connection to the database.
 * @returns the tags queried from the database.
 */Great 
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