'use strict';

/** Template for posts that appear upon search. */
const template = document.createElement('template');

/** The session of the client user. */
let session;

docLoaded(async () => {
  await getData('/get-session?', getSession);
  await getData('/get-template?', getTemplate);
  getData('/get-filter-posts?', renderPosts);
  getData('/get-filter-users?', renderUsers);

  document.getElementById("header-search").addEventListener("submit", search);
});

/**
 * docLoaded. Runs a callback function when the web page is loaded.
 * @param {function} action - the function to run when the DOM is loaded.
 */
function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

/**
 * search. Sends search parameters to the server and runs functions to print returned data on the DOM.
 * @param {Event} e - the event occuring on the search button. 
 * @returns 
 */
function search(e) {
  e.preventDefault();
  const url = new URL(window.location);
  url.searchParams.set(e.target.search.name, e.target.search.value);
  window.history.pushState('', '', url);
  getData('/get-filter-users?', renderUsers);
  getData('/get-filter-posts?', renderPosts);
  return false;
}

/**
 * getData. Retrieve information from a specified path and then 
 * execute a callback with that information.
 * @param {String} path - the get path to server
 * @param {function} callback - the callback function to run
 */
async function getData(path, callback) {
  try {
    let response = await fetch(path + new URLSearchParams(window.location.search), {
      method: 'GET'
    });
    if (response.status == 200) {
      response = await response.text();
      response = JSON.parse(response);
      callback(response);
    }
  } catch (err) { console.log(err); }
}

/**
 * getSession. Sets the global variable session using the session in the server response.
 * @param {Object} response - the server response.
 */
function getSession(response) {
  session = response.session;
}

/**
 * getTemplate. Set the HTML of the global variable template using the DOM object in the server response.
 * @param {Object} response - the server response. 
 */
function getTemplate(response) {
  template.innerHTML = response.dom;
}

/**
 * renderUsers. Renders users as cards on the search result page.
 * @param {Object[]} users - the users returned by the search query.
 */
function renderUsers(users) {
  let uBody = document.querySelector(".user-block");
  while (uBody.firstChild) {
    uBody.removeChild(uBody.firstChild);
  }
  let pTemplateContent = template.content.getElementById("post-template").content;

  for (let i = 0; i < users.users.length; i++) {
    let user = users.users[i][0];
    let clone = pTemplateContent.cloneNode(true);
    clone.querySelector("#post-user-avatar").src = "./avatars/" + user.profilePic;
    clone.querySelector("#post-business-name").textContent = user.cName;
    clone.querySelector("#post-business-type").textContent = user.bType;
    clone.querySelector("#link-avatar").href = "/users?user=" + user.username;
    clone.querySelector("#link-bName").href = "/users?user=" + user.username;
    clone.querySelector(".post-body").remove();
    uBody.appendChild(clone);
  }
}

/**
 * renderUsers. Renders posts on the search result page.
 * @param {Object[]} users - the users returned by the search query.
 */
function renderPosts(posts) {
  let pBody = document.querySelector(".post-block");
  while (pBody.firstChild) {
    pBody.removeChild(pBody.firstChild);
  }

  let pTemplateContent = template.content.getElementById("post-template").content;
  let pImgTemplateContent = template.content.getElementById("image-template").content;
  let pTagTemplateContent = template.content.getElementById("tag-template").content;
  let pEditTemplateContent = template.content.getElementById("edit-template").content;
  let pAddImgTemplateContent = template.content.getElementById("add-image-template").content;

  for (let i = 0; i < posts.posts.length; i++) {
    let postData = posts.posts[i];
    let user = postData.user[0];
    let post = postData.post[0];
    let postImages = postData.imgs;
    let postTags = postData.tags;

    let clone = pTemplateContent.cloneNode(true);
    clone.querySelector("#post").dataset.postId = post.postId;
    clone.querySelector("#post").dataset.username = post.username;
    clone.querySelector("#post-user-avatar").src = "./avatars/" + user.profilePic;
    clone.querySelector("#post-business-name").textContent = user.cName;
    clone.querySelector("#post-business-type").textContent = user.bType;
    clone.querySelector("#post-timestamp").textContent = post.timestamp.split(' ').slice(1).join(' ');
    clone.querySelector("#post-description").textContent = post.content;
    clone.querySelector("#post-title").textContent = post.postTitle;
    clone.querySelector("#link-avatar").href = "/users?user=" + user.username;
    clone.querySelector("#link-bName").href = "/users?user=" + user.username;


    let pImgs = clone.querySelector(".gallery");
    let pTags = clone.querySelector(".post-tags");
    for (const image of postImages) {
      if (image) {
        let img = pImgTemplateContent.cloneNode(true);
        img.querySelector("img").src = "./images/" + image.imgFile;
        img.querySelector("img").alt = image.imgFile;
        pImgs.appendChild(img);
      }
    }

    let pAddImgs = pAddImgTemplateContent.cloneNode(true);
    pImgs.parentNode.appendChild(pAddImgs);

    for (const tags of postTags) {
      if (tags) {
        let tag = pTagTemplateContent.cloneNode(true);
        tag.querySelector("a").textContent = '#' + tags.tag;
        tag.querySelector("a").href = '#' + tags.tag;
        pTags.appendChild(tag);
      }
    }

    if (session.username == post.username) {
      let pEdit = pEditTemplateContent.cloneNode(true);
      clone.querySelector("#post-footer").appendChild(pEdit);
    }
    pBody.appendChild(clone);
  }
}
