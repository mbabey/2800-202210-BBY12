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
    let imageField = document.querySelectorAll("#post-images");
    imageField.forEach((target) => {
        target.addEventListener("change", addImage, false);
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
    let post = event.target.parentNode.parentNode;
    disableEdit(post);
    let title = post.querySelector(".post-title").textContent;
    let desc = post.querySelector(".post-description").textContent
    let tags = post.querySelector(".post-tags").textContent;
    let imgs = post.querySelector(".edit-image-upload");

    const formData = new FormData();
    formData.append("username", post.dataset.username);
    formData.append("postId", post.dataset.postId);
    formData.append("input-title", title);
    formData.append("input-description", desc);
    formData.append("tag-field", tags);
    for (let i = 0; i < imgs.files.length; i++) {
        formData.append("image-upload", imgs.files[i]);
    }

    fetch('/edit-post', {
        method: 'POST',
        body: formData,
    }).catch(error => {
        console.error('Error:', error);
    });
}

function addImage(event) {
    let post = event.target.parentNode.parentNode;
    let imgs = post.querySelector(".edit-image-upload");
    console.log(imgs.files[imgs.files.length - 1]);

    const image = document.createElement('img');
    image.src = URL.createObjectURL(imgs.files[imgs.files.length - 1]);
    imgs.appendChild(image);
}

function enableEdit(post) {
    post.querySelector(".add-image-hide").setAttribute("class", "add-image");
    post.querySelector(".post-delete-hide").setAttribute("class", "post-delete");
    post.querySelector(".post-save-hide").setAttribute("class", "post-save");
    post.querySelector(".post-edit").setAttribute("class", "post-edit-hide");

    let fields = [post.querySelector(".post-title"), post.querySelector(".post-description"), post.querySelector(".post-tags")]

    for (let i = 0; i < fields.length; i++) {
        fields[i].setAttribute("contentEditable", "true");
        fields[i].style.border = "1px solid black";
    }
}

function disableEdit(post) {
    post.querySelector(".add-image").setAttribute("class", "add-image-hide");
    post.querySelector(".post-delete").setAttribute("class", "post-delete-hide");
    post.querySelector(".post-save").setAttribute("class", "post-save-hide");
    post.querySelector(".post-edit-hide").setAttribute("class", "post-edit");

    let fields = [post.querySelector(".post-title"), post.querySelector(".post-description"), post.querySelector(".post-tags")]

    for (let i = 0; i < fields.length; i++) {
        fields[i].setAttribute("contentEditable", "false");
        fields[i].style.border = "none";
    }
}

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}