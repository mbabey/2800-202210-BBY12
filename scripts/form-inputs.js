'use strict';

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

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
};
