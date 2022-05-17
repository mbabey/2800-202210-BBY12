'use strict';
docLoaded(() => {
    let editButtons = document.querySelectorAll("#post-edit");
    editButtons.forEach((target) => {
        target.addEventListener("click", editPost, false);
    });

    let saveButtons = document.querySelectorAll("#post-save");
    saveButtons.forEach((target) => {
        target.addEventListener("click", savePost, false);
    });
});

async function editPost(event) {
    let post = event.target.parentNode.parentNode;
    // console.log('/get-post/' + post.dataset.username + '/' + post.dataset.postId);

    try {
        // let response = await fetch('/get-post/' + post.dataset.username + '/' + post.dataset.postId, {
        //     method: 'GET'
        // });
        // if (response.status == 200) {
        //     let data = await response.text();
        //     console.log(JSON.parse(data));

        // }
        enableEdit(post);
    } catch (err) {

    }
}

function savePost(event) {
    console.log("saved");
    let post = event.target.parentNode.parentNode;
    disableEdit(post);
}

function enableEdit(post) {
    console.log(post.querySelector(".add-image-hide"));
    post.querySelector(".add-image-hide").setAttribute("class", "add-image");
    post.querySelector(".post-delete-hide").setAttribute("class", "post-delete");
    post.querySelector(".post-save-hide").setAttribute("class", "post-save");
    post.querySelector(".post-edit").setAttribute("class", "post-edit-hide");

    post.querySelector(".post-title").setAttribute("contentEditable", "true");
    post.querySelector(".post-description").setAttribute("contentEditable", "true");
    post.querySelector(".post-tags").setAttribute("contentEditable", "true");
}

function disableEdit(post) {
    console.log(post.querySelector(".add-image-hide"));
    post.querySelector(".add-image").setAttribute("class", "add-image-hide");
    post.querySelector(".post-delete").setAttribute("class", "post-delete-hide");
    post.querySelector(".post-save").setAttribute("class", "post-save-hide");
    post.querySelector(".post-edit-hide").setAttribute("class", "post-edit");

    post.querySelector(".post-title").setAttribute("contentEditable", "false");
    post.querySelector(".post-description").setAttribute("contentEditable", "false");
    post.querySelector(".post-tags").setAttribute("contentEditable", "false");
}

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}