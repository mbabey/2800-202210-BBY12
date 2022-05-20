'use strict';

const template = document.createElement( 'template' );
let session;
docLoaded(async () => {
    await getSearchData('/get-session?', getSession);
    await getSearchData('/get-template?', getTemplate);
    getSearchData('/get-filter-posts?', renderPosts);
    getSearchData('/get-filter-users?', renderUsers);
    
    document.getElementById("header-search").addEventListener("submit", search);
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

function search(e) {
    e.preventDefault();
    const url = new URL(window.location);
    url.searchParams.set(e.target.search.name , e.target.search.value);
    window.history.pushState('','',url);
    getSearchData('/get-filter-users?', renderUsers);
    getSearchData('/get-filter-posts?', renderPosts);
    return false;
}

async function getSearchData(path, callback) {
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

function getSession(response) {
    session = response.session;
}

function getTemplate(response) {
    template.innerHTML = response.dom;
}

function renderUsers(users) {
    let uBody = document.querySelector(".user-block");
    while(uBody.firstChild){
        uBody.removeChild(uBody.firstChild);
    }
    let pTemplateContent = template.content.getElementById("post-template").content;

    for (let i = 0; i < users.users.length; i++) {
        let user = users.users[i][0];
        let clone = pTemplateContent.cloneNode(true);
        clone.querySelector("#post-user-avatar").src = "./avatars/" + user.profilePic;
        clone.querySelector("#post-business-name").textContent = user.cName;
        clone.querySelector("#post-business-type").textContent = user.bType;
        clone.querySelector("#link-avatar").href = "/users/" + user.username;
        clone.querySelector("#link-bName").href = "/users/" + user.username;
        clone.querySelector(".post-body").remove();
        uBody.appendChild(clone);
    }
}

function renderPosts(posts) {
    let pBody = document.querySelector(".post-block");
    while(pBody.firstChild){
        pBody.removeChild(pBody.firstChild);
    }

    let pTemplateContent = template.content.getElementById("post-template").content;
    let pImgTemplateContent = template.content.getElementById("image-template").content;
    let pTagTemplateContent = template.content.getElementById("tag-template").content;
    let pEditTemplateContent = template.content.getElementById("edit-template").content;
    let pAddImgTemplateContent = template.content.getElementById("add-image-template").content;

    for (let i = 0; i < posts.posts.length; i++) {
        let postData = posts.posts[i];
        let user = postData["user"][0];
        let post = postData["post"][0];
        let postImages = postData["imgs"];
        let postTags = postData["tags"];

        let clone = pTemplateContent.cloneNode(true);
        clone.querySelector("#post").dataset.postId = post.postId;
        clone.querySelector("#post").dataset.username = post.username;
        clone.querySelector("#post-user-avatar").src = "./avatars/" + user.profilePic;
        clone.querySelector("#post-business-name").textContent = user.cName;
        clone.querySelector("#post-business-type").textContent = user.bType;
        clone.querySelector("#post-timestamp").textContent = post.timestamp.split(' ').slice(1).join(' ');
        clone.querySelector("#post-description").textContent = post.content;
        clone.querySelector("#post-title").textContent = post.postTitle;
        clone.querySelector("#link-avatar").href = "/users/" + user.username;
        clone.querySelector("#link-bName").href = "/users/" + user.username;


        let pImgs = clone.querySelector(".gallery");
        let pTags = clone.querySelector(".post-tags");
        for (const image of postImages) {
            if (image) {
                let img = pImgTemplateContent.cloneNode(true);
                img.querySelector("img").src = "./images/" + image["imgFile"];
                img.querySelector("img").alt = image["imgFile"];
                pImgs.appendChild(img);
            }
        }

        let pAddImgs = pAddImgTemplateContent.cloneNode(true);
        pImgs.parentNode.appendChild(pAddImgs);

        for (const tags of postTags) {
            if (tags) {
                let tag = pTagTemplateContent.cloneNode(true);
                tag.querySelector("a").textContent = '#' + tags["tag"];
                tag.querySelector("a").href = '#' + tags["tag"];
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