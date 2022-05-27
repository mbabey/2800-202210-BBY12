'use strict';
docLoaded(() => {
    let deleteButton = document.querySelectorAll("#post-delete");
    deleteButton.forEach((target) => {
        target.addEventListener("click", deletePost, false);
    });
});

function deletePost(event) {
    let post = event.target.parentNode.parentNode.parentNode;
    const formData = new FormData();
    formData.append("username", post.dataset.username);
    formData.append("postId", post.dataset.postId);
    sendData(formData)
    post.remove();
}

/**
 * sendData. Sends information to a specified path.
 * @param {Object} data - the data to send to the server
 */
 async function sendData(data) {
  try {
    await fetch('/delete-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    });
  } catch (err) {
    console.log(err);
  }
}

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
