'use strict';
docLoaded(() => {

  // Add event listeners to all post edit buttons.
  document.querySelectorAll("#post-edit").forEach((target) => {
    target.addEventListener("click", editPost, false);
  });
  
  // Add event listeners to all post save buttons.
  document.querySelectorAll("#post-save").forEach((target) => {
    target.addEventListener("click", savePost, false);
  });
  
  // Add event listeners to all post cancel buttons.
  document.querySelectorAll("#post-cancel").forEach((target) => {
    target.addEventListener("click", cancelEdit, false);
  });
  
  // Add event listeners to all post images.
  document.querySelectorAll("#post-images").forEach((target) => {
    target.addEventListener("change", addImage, false);
  });
});

/**
 * editPost. Selects the post that is the parent of the pressed edit button.
 * @param {Event} event - the event that occurred on the edit post button 
 */
async function editPost(event) {
  let post = event.target.parentNode.parentNode.parentNode;
  enableEdit(post);
}

/**
 * savePost. Save the edited post's content and send the new content to the server.
 * @param {Event} event - the event that occurred on the save post button.
 */
function savePost(event) {
  let post = event.target.parentNode.parentNode.parentNode;
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
    let img = gallery[i].src.toString().split('/')[gallery[i].src.toString().split('/').length - 1];
    formData.append("image-delete", img);
  }
  for (let i = 0; i < imgs.files.length; i++) {
    formData.append("image-upload", imgs.files[i]);
  }

  fetch('/edit-post', {
    method: 'POST',
    body: formData,
  }).then(() => {
    disableEdit(post);
  }).catch(error => {
    console.error('Error:', error);
  });
}

/**
 * cancelEdit. Cancel the editing of the post and return the data to its original state.
 * @param {Event} event - the event that occurred on the cancel edit button.
 */
async function cancelEdit(event) {
  let post = event.target.parentNode.parentNode.parentNode;
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

/**
 * addImage. Adds images that have been uploaded to the post to the preview gallery.
 * @param {Event} event - the event that targets the add image button.
 */
function addImage(event) {
  let imageHolder = event.target.parentNode.parentNode.parentNode;
  let preview = imageHolder.querySelector(".preview-gallery");
  let imgs = imageHolder.querySelector(".edit-image-upload");
  preview.innerHTML = "";
  for (let i = 0; i < imgs.files.length; i++) {
    preview.innerHTML += `<div class="frame-preview"><img src="#" alt=""></div>`;
    preview.querySelectorAll("img")[i].src = URL.createObjectURL(imgs.files[i]);
  }
}

/**
 * enableEdit. Enable editing of all post fields and allow uploading of new images.
 * @param {DOM element} post - the post to be edited. 
 */
function enableEdit(post) {
  post.querySelector(".add-image-hide").setAttribute("class", "add-image");
  post.querySelector(".post-delete-hide").setAttribute("class", "post-delete");
  post.querySelector(".post-cancel-hide").setAttribute("class", "post-cancel");
  post.querySelector(".post-save-hide").setAttribute("class", "post-save");
  post.querySelector(".post-edit").setAttribute("class", "post-edit-hide");
  post.querySelectorAll(".input-label-hide").forEach((label) => {
    label.setAttribute("class", "input-label");
  });

  let frames = post.querySelectorAll(".frame");
  for (let i = 0; i < frames.length; i++) {
    frames[i].innerHTML += `<button class="delete-image" id="delete-image">Delete Image</button>`;
  }

  let deleteImgs = post.querySelectorAll("#delete-image");
  deleteImgs.forEach((target) => {
    target.addEventListener("click", deleteImg, false);
  });

  let fields = [post.querySelector(".post-title"), post.querySelector(".post-description"), post.querySelector(".post-tags")];

  for (let i = 0; i < fields.length; i++) {
    fields[i].setAttribute("contenteditable", "true");
    fields[i].style.border = "2px solid var(--primary-dark)";
  }
}

/**
 * deleteImg. Delete the image from the post.
 * @param {Event} event - the event that targets the delete image button. 
 */
function deleteImg(event) {
  event.target.parentNode.setAttribute("class", "frame-delete");
}

/**
 * disableEdit. Disable editing of the post and return it to its original state.
 * @param {DOM element} post - the post being edited. 
 */
function disableEdit(post) {
  post.querySelector(".add-image").setAttribute("class", "add-image-hide");
  post.querySelector(".post-delete").setAttribute("class", "post-delete-hide");
  post.querySelector(".post-cancel").setAttribute("class", "post-cancel-hide");
  post.querySelector(".post-save").setAttribute("class", "post-save-hide");
  post.querySelector(".post-edit-hide").setAttribute("class", "post-edit");
  post.querySelectorAll(".input-label").forEach((label) => {
    label.setAttribute("class", "input-label-hide");
  });

  post.querySelector(".edit-image-upload").value = "";

  let deleteImgs = post.querySelectorAll("#delete-image");
  deleteImgs.forEach((target) => {
    target.remove();
  });

  let fields = [post.querySelector(".post-title"), post.querySelector(".post-description"), post.querySelector(".post-tags")];

  for (let i = 0; i < fields.length; i++) {
    fields[i].setAttribute("contenteditable", "false");
    fields[i].style.border = "none";
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
