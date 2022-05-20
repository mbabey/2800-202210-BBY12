'use strict';

docLoaded(() => {
  // Function from https://www.instagram.com/p/CdGXl-1PJZ1/?utm_source=ig_web_copy_link
  document.querySelectorAll('.create-input').forEach((input) => {
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
}

// let visi_p_span = document.querySelector('#visibility-p');
// visi_p_span.addEventListener("click", function() {
//   document.querySelector('#password').setAttribute("type", "text");
//   // document.querySelector('#password-verify').setAttribute("type", "text");
// document.querySelector('svg-p').setAttribute("d", "M24 31.5Q27.55 31.5 30.025 29.025Q32.5 26.55 32.5 23Q32.5 19.45 30.025 16.975Q27.55 14.5 24 14.5Q20.45 14.5 17.975 16.975Q15.5 19.45 15.5 23Q15.5 26.55 17.975 29.025Q20.45 31.5 24 31.5ZM24 28.6Q21.65 28.6 20.025 26.975Q18.4 25.35 18.4 23Q18.4 20.65 20.025 19.025Q21.65 17.4 24 17.4Q26.35 17.4 27.975 19.025Q29.6 20.65 29.6 23Q29.6 25.35 27.975 26.975Q26.35 28.6 24 28.6ZM24 38Q16.7 38 10.8 33.85Q4.9 29.7 2 23Q4.9 16.3 10.8 12.15Q16.7 8 24 8Q31.3 8 37.2 12.15Q43.1 16.3 46 23Q43.1 29.7 37.2 33.85Q31.3 38 24 38ZM24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23ZM24 35Q30.05 35 35.125 31.725Q40.2 28.45 42.85 23Q40.2 17.55 35.125 14.275Q30.05 11 24 11Q17.95 11 12.875 14.275Q7.8 17.55 5.1 23Q7.8 28.45 12.875 31.725Q17.95 35 24 35Z");

  
// });

// let visi_p_span = document.querySelector('#visibility-p');
// visi_p_span.addEventListener("click", function() {
//   console.log("123");
// });
