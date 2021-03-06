'use strict';

/**
 * For all input fields, if the user is not focusing on the specific field anymore,
 *     check if the field value is empty. If it's not empty, give a class name "filled",
 *     otherwise, remove the class name.
 */
docLoaded(() => {
  // Function from https://www.instagram.com/p/CdGXl-1PJZ1/?utm_source=ig_web_copy_link
  document.querySelectorAll('.input').forEach((input) => {
    input.addEventListener('blur', (e) => {
      if (e.target.value != "")
        e.target.nextElementSibling.classList.add('filled');
      else
        e.target.nextElementSibling.classList.remove('filled');
    });
  });
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
