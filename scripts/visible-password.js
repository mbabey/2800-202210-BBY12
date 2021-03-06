'use strict';

docLoaded(() => {

  // Add event listeners to all password toggle buttons.
  document.querySelectorAll('.visible-password-toggle').forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      togglePasswordVisibility(e, toggle);
    });
  });
});

/**
 * togglePasswordVisibility. Toggles the type of the target input between password and text.
 * @param {Event} e - the event targeting the toggle button. 
 * @param {DOM element} toggle - the svg that makes up the toggle button. 
 */
function togglePasswordVisibility(e, toggle) {
  try {
    let passwordInput = e.target.parentNode.parentNode.querySelector('.password');
    if (passwordInput === null) {
      passwordInput = e.target.parentNode.parentNode.parentNode.querySelector('.password');
    }
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggle.querySelector('.visible-password-toggle-path').setAttribute("d", "M24 31.5Q27.55 31.5 30.025 29.025Q32.5 26.55 32.5 23Q32.5 19.45 30.025 16.975Q27.55 14.5 24 14.5Q20.45 14.5 17.975 16.975Q15.5 19.45 15.5 23Q15.5 26.55 17.975 29.025Q20.45 31.5 24 31.5ZM24 28.6Q21.65 28.6 20.025 26.975Q18.4 25.35 18.4 23Q18.4 20.65 20.025 19.025Q21.65 17.4 24 17.4Q26.35 17.4 27.975 19.025Q29.6 20.65 29.6 23Q29.6 25.35 27.975 26.975Q26.35 28.6 24 28.6ZM24 38Q16.7 38 10.8 33.85Q4.9 29.7 2 23Q4.9 16.3 10.8 12.15Q16.7 8 24 8Q31.3 8 37.2 12.15Q43.1 16.3 46 23Q43.1 29.7 37.2 33.85Q31.3 38 24 38ZM24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23ZM24 35Q30.05 35 35.125 31.725Q40.2 28.45 42.85 23Q40.2 17.55 35.125 14.275Q30.05 11 24 11Q17.95 11 12.875 14.275Q7.8 17.55 5.1 23Q7.8 28.45 12.875 31.725Q17.95 35 24 35Z");
    } else {
      passwordInput.type = "password";
      toggle.querySelector('.visible-password-toggle-path').setAttribute("d", "M31.45 27.05 29.25 24.85Q30.55 21.3 27.9 18.95Q25.25 16.6 22.15 17.75L19.95 15.55Q20.8 15 21.85 14.75Q22.9 14.5 24 14.5Q27.55 14.5 30.025 16.975Q32.5 19.45 32.5 23Q32.5 24.1 32.225 25.175Q31.95 26.25 31.45 27.05ZM37.9 33.5 35.9 31.5Q38.35 29.7 40.175 27.475Q42 25.25 42.85 23Q40.35 17.45 35.35 14.225Q30.35 11 24.5 11Q22.4 11 20.2 11.4Q18 11.8 16.75 12.35L14.45 10Q16.2 9.2 18.925 8.6Q21.65 8 24.25 8Q31.4 8 37.325 12.075Q43.25 16.15 46 23Q44.7 26.2 42.65 28.85Q40.6 31.5 37.9 33.5ZM40.8 44.8 32.4 36.55Q30.65 37.25 28.45 37.625Q26.25 38 24 38Q16.7 38 10.75 33.925Q4.8 29.85 2 23Q3 20.4 4.775 17.925Q6.55 15.45 9.1 13.2L2.8 6.9L4.9 4.75L42.75 42.6ZM11.15 15.3Q9.3 16.65 7.575 18.85Q5.85 21.05 5.1 23Q7.65 28.55 12.775 31.775Q17.9 35 24.4 35Q26.05 35 27.65 34.8Q29.25 34.6 30.05 34.2L26.85 31Q26.3 31.25 25.5 31.375Q24.7 31.5 24 31.5Q20.5 31.5 18 29.05Q15.5 26.6 15.5 23Q15.5 22.25 15.625 21.5Q15.75 20.75 16 20.15ZM26.4 22.4Q26.4 22.4 26.4 22.4Q26.4 22.4 26.4 22.4Q26.4 22.4 26.4 22.4Q26.4 22.4 26.4 22.4Q26.4 22.4 26.4 22.4Q26.4 22.4 26.4 22.4ZM20.6 25.3Q20.6 25.3 20.6 25.3Q20.6 25.3 20.6 25.3Q20.6 25.3 20.6 25.3Q20.6 25.3 20.6 25.3Q20.6 25.3 20.6 25.3Q20.6 25.3 20.6 25.3Z");
    }
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
