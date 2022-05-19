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

    let cancelButtons = document.querySelectorAll("#post-cancel");
    cancelButtons.forEach((target) => {
        target.addEventListener("click", cancelEdit, false);
    });

    let imageField = document.querySelectorAll("#post-images");
    imageField.forEach((target) => {
        target.addEventListener("change", addImage, false);
    });
});

async function editPost(event) {
    let post = event.target.parentNode.parentNode;
    // console.log('/get-post/' + post.dataset.username + '/' + post.dataset.postId);
    enableEdit(post);
}

// SAVE EDIT POST AND SAVE CHANGES
function savePost(event) {
    let post = event.target.parentNode.parentNode;
    disableEdit(post);
    let title = post.querySelector(".post-title").textContent;
    let desc = post.querySelector(".post-description").textContent;
    let tags = post.querySelector(".post-tags").textContent;
    let gallery = post.querySelectorAll(".gallery .frame-delete img");
    let imgs = post.querySelector(".edit-image-upload");

    const formData = new FormData();
    formData.append("username", post.dataset.username);
    formData.append("postId", post.dataset.postId);
    formData.append("input-title", title);
    formData.append("input-description", desc);
    formData.append("tag-field", tags);

    for (let i = 0; i < gallery.length; i++) {
        let img = gallery[i].src.toString().split('/')[gallery[i].src.toString().split('/').length -1]
        formData.append("image-delete", img);
    }
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

// CANCEL EDIT POST AND REVERT CHANGES
async function cancelEdit(event) {
    let post = event.target.parentNode.parentNode;
    disableEdit(post);
    try {
        let response = await fetch('/get-post/' + post.dataset.username + '/' + post.dataset.postId, {
            method: 'GET'
        });
        if (response.status == 200) {
            let data = await response.text();
            data = JSON.parse(data);

            let postText = data[0];
            let postImgs = data[1];
            let postTags = data[2];

            post.querySelector(".post-title").textContent = postText[0].postTitle;
            post.querySelector(".post-description").textContent = postText[0].content;
            //post.querySelector(".post-tags").textContent = data[0].postTitle;
            let gallery = post.querySelector(".gallery");
            gallery.innerHTML = "";
            for (let i = 0; i < postImgs.length; i++) {
                gallery.innerHTML += `<div class="frame"><img src="#" alt=""></div>`;
                gallery.querySelectorAll(".frame > img")[i].src = "./images/" + postImgs[i].imgFile;
                gallery.querySelectorAll(".frame > img")[i].alt = postImgs[i].imgFile;

            }
            let preview = post.querySelector(".preview-gallery");
            preview.innerHTML = "";

            let tagField = post.querySelector(".post-tags");
            tagField.innerHTML = "";
            for (let i = 0; i < postTags.length; i++) {
                tagField.innerHTML += `<a href="#"></a>`;
                tagField.querySelectorAll("a")[i].textContent = '#' + postTags[i].tag;
                tagField.querySelectorAll("a")[i].href = '#' + postTags[i].tag;
                tagField.innerHTML += " ";
            }

        }
    } catch (err) {
        console.log(err);
    }
}

function addImage(event) {
    let preview = event.target.parentNode.parentNode.previousElementSibling;
    let imageHolder = gallery.parentNode;
    let imgs = imageHolder.querySelector(".edit-image-upload");
    preview.innerHTML = "";
    for (let i = 0; i < imgs.files.length; i++) {
        preview.innerHTML += `<div class="frame-preview"><img src="#" alt=""></div>`;
        preview.querySelectorAll("img")[i].src = URL.createObjectURL(imgs.files[i]);

    }
}

function enableEdit(post) {
    post.querySelector(".add-image-hide").setAttribute("class", "add-image");
    post.querySelector(".post-delete-hide").setAttribute("class", "post-delete");
    post.querySelector(".post-cancel-hide").setAttribute("class", "post-cancel");
    post.querySelector(".post-save-hide").setAttribute("class", "post-save");
    post.querySelector(".post-edit").setAttribute("class", "post-edit-hide");

    let frames = post.querySelectorAll(".frame");
    for(  let i = 0; i < frames.length; i++){
        console.log(frames[i])
        frames[i].innerHTML += `<button class="delete-image" id="delete-image">Delete Image</button>`;
    }

    let deleteImgs = post.querySelectorAll("#delete-image");
    deleteImgs.forEach((target) => {
        target.addEventListener("click", deleteImg, false);
    });

    let fields = [post.querySelector(".post-title"), post.querySelector(".post-description"), post.querySelector(".post-tags")];

    for (let i = 0; i < fields.length; i++) {
        fields[i].setAttribute("contentEditable", "true");
        fields[i].style.border = "1px solid black";
    }


}

function deleteImg(event){
    event.target.parentNode.setAttribute("class", "frame-delete")
}

function disableEdit(post) {
    post.querySelector(".add-image").setAttribute("class", "add-image-hide");
    post.querySelector(".post-delete").setAttribute("class", "post-delete-hide");
    post.querySelector(".post-cancel").setAttribute("class", "post-cancel-hide");
    post.querySelector(".post-save").setAttribute("class", "post-save-hide");
    post.querySelector(".post-edit-hide").setAttribute("class", "post-edit");

    post.querySelector(".edit-image-upload").value = "";

    let deleteImgs = post.querySelectorAll("#delete-image");
    deleteImgs.forEach((target) => {
        target.remove();
    });

    let fields = [post.querySelector(".post-title"), post.querySelector(".post-description"), post.querySelector(".post-tags")];

    for (let i = 0; i < fields.length; i++) {
        fields[i].setAttribute("contentEditable", "false");
        fields[i].style.border = "none";
    }
}

// async function addLink(){
//     let aTag = document.createElement("a");
//     aTag.href = window.location.hostname + '/' + post.dataset.username;
    
// }


function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}