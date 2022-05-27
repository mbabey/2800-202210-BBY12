'use strict';

docLoaded(() => {
  // Event listener for cancel button to redirect back a page.
  document.querySelector('#cancel-button').addEventListener('click', () => {
    window.history.back();
  });

  // Event listener for input tag to react to enter key press.
  document.getElementById("input-tag").onkeypress = function (e) {
    if (checkKey(e)) {
      e.preventDefault();
      writeTag()
    }
  }

  // Event listener for input title to react to enter key press.
  document.getElementById("input-title").onkeypress = function (e) {
    if (checkKey(e)) {
      e.preventDefault();
    }
  }
});


/**
 * checkKey. Checks the event to determine if it is the enter key. 
 * @param {*} e - the event
 * @returns true if key pressed is enter key.
 */
function checkKey(e) {
  let key = e.charCode || e.keyCode || 0;
  return (key == 13)
}

/**
 * writeTag. Formats tags that have been entered into the input into a storeable a form.
 */
function writeTag() {
  let tagField = document.getElementById("tag-field");
  const re = /[\s,]/
  let tags = document.getElementById("input-tag").value.split(re);
  tags.forEach(tag => {
    if (tag) tagField.value += "#" + tag + " ";
  });
  document.getElementById("input-tag").value = "";
}

/**
 * docLoaded. Executes a callback function when the DOM content is loaded.
 * @param {*} action - the callback function.
 */
function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}
