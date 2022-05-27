'use strict';

/**
 * Add listeners to the footers, populate the username in the nav bar,
 *     add admin dashboard button (star) to the nav bar if the user is an admin
 *     after loading the webpage
 */
docLoaded(() => {
  document.querySelector('footer #footer-search').addEventListener("click", openOverlay, false);
  getData('/get-user', popNavName);
  getData('/is-admin', (isAdmin) => {
    if (isAdmin.admin) {
      addAdminStar();
    }
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

/**
 * getData. Retrieve information from a specified path and then 
 * execute a callback with that information.
 * @param {String} path - the get path to server
 * @param {function} callback - the callback function to run
 */
async function getData(path, callback) {
  try {
    let response = await fetch(path, {
      method: 'GET'
    });
    if (response.status == 200) {
      response = await response.text();
      response = JSON.parse(response);
      callback(response);
    }
  } catch (err) { }
}

/**
 * popNavName. Populates the profile icon with the username
 * @param {Object} data - The data retrieved from the database on the current user
 */
function popNavName(data) {
  document.querySelector('#nav-profile').href += (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
  document.querySelector('#profile-name').innerHTML = (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
}

/**
 * addAdminStar. Adds the admin navbar button (star) if the user is an admin
 */
function addAdminStar() {
  let admin_button = document.querySelector('#nav-admin');
  admin_button.setAttribute('href', "/admin-manage-users");
  admin_button.setAttribute('class', "nav-button");

  let content = "<svg xmlns='http://www.w3.org/2000/svg' viewbox='0 0 48 48' height='32' width='32'>" +
    "<path fill='currentColor' d='M24 25.15ZM11.65 44 16.3 28.8 4 20H19.2L24 4L28.8 20H44L31.7 28.8L36.35 44L24 34.6ZM17.15 35.85 24 30.65 30.85 35.85 28.1 27.2 34.4 23.1H26.85L24 14.45L21.15 23.1H13.6L19.9 27.2Z' />" +
    "</svg> <span>Admin</span>";

  admin_button.innerHTML = content;
}

/**
 * openOverlay. Brings the search overlay up to cover the screen.
 */
function openOverlay(){
  document.getElementById("overlay").style.top = "0vh";
}

/**
 * closeOverlay. Pushes the search overlay below the screen.
 */
function closeOverlay() {
  document.getElementById("overlay").style.top = "100vh";
}
