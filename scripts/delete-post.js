'use strict';
docLoaded(() => {
    let deleteButton = document.querySelectorAll("#post-delete");
    deleteButton.forEach((target) => {
        target.addEventListener("click", deletePost, false);
    });
});

/**
 * deletePost. Removes the post that is the target of the mouse event from 
 * the database and from the DOM.
 * @param {Event} event - the mouse event targeting the delete button. 
 */
function deletePost(event) {
    let post = event.target.parentNode.parentNode.parentNode;
    const formData = new FormData();
    formData.append("username", post.dataset.username);
    formData.append("postId", post.dataset.postId);
    sendFormData(formData);
    post.remove();
}

/**
 * sendFormData. Sends information to a specified path.
 * @param {Object} data - the data to send to the server
 */
 async function sendFormData(data) {
  try {
    await fetch('/delete-post', {
      method: 'POST',
      body: data
    });
  } catch (err) {
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
