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
 * Run the rest of the script when the web page is loaded
 * @param {*} action Run the actions on the script
 */
function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

/**
 * Retrieve the username and the admin status
 * @param {String} path the get path to server
 * @param {*} callback the callback function to run
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
 * Populating the profile icon with the username
 * @param {*} data The data retrieved fro the database on the current user
 */
function popNavName(data) {
  document.querySelector('#nav-profile').href += (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
  document.querySelector('#profile-name').innerHTML = (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
}

/**
 * Adding the admin dashboard button (star) if the user is an admin
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
 * Styling the overlay on the nav/footer
 */
function openOverlay(){
  document.getElementById("overlay").style.top = "0vh";
}

/**
 * Styling the overlay on the nav/footer
 */
function closeOverlay() {
  document.getElementById("overlay").style.top = "100vh";
}
