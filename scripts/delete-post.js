'use strict';
docLoaded(() => {
    let deleteButton = document.querySelectorAll("#post-delete");
    deleteButton.forEach((target) => {
        target.addEventListener("click", deletePost, false);
    });
});

function deletePost(event) {
    let post = event.target.parentNode.parentNode;
    const formData = new FormData();
    formData.append("username", post.dataset.username);
    formData.append("postId", post.dataset.postId);
    fetch('/delete-post', {
        method: 'POST',
        body: formData
    }).catch((err) => {
        console.log(err);
    });
    post.remove();
}

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}