'use strict';

docLoaded(() => {
  getData('/nav-and-footer', popNavAndFooter);
  getData('/search-overlay', popSearchOverlay);
  getData('/get-user', popNavName);
  getData('/is-admin', (isAdmin) => {
    if (isAdmin.admin) {
      addAdminStar();
    }
  });
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

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

function popNavAndFooter(navAndFooter) {
  document.querySelector('nav').innerHTML = navAndFooter.nav;
  document.querySelector('footer').innerHTML = navAndFooter.footer;
}

function popSearchOverlay(searchOverlay){
  document.querySelector('footer').innerHTML += searchOverlay.overlay;
  document.querySelector('footer #footer-search').addEventListener("click", openOverlay, false);
}

function popNavName(data) {
  document.querySelector('#nav-profile').href += (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
  document.querySelector('#profile-name').innerHTML = (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
}

function addAdminStar() {
  let admin_button = document.querySelector('#nav-admin');
  admin_button.setAttribute('href', "/admin-dashboard");
  admin_button.setAttribute('class', "nav-button");

  let content = "<svg xmlns='http://www.w3.org/2000/svg' viewbox='0 0 48 48' height='32' width='32'>" +
    "<path fill='currentColor' d='M24 25.15ZM11.65 44 16.3 28.8 4 20H19.2L24 4L28.8 20H44L31.7 28.8L36.35 44L24 34.6ZM17.15 35.85 24 30.65 30.85 35.85 28.1 27.2 34.4 23.1H26.85L24 14.45L21.15 23.1H13.6L19.9 27.2Z' />" +
    "</svg> <span>Admin</span>";

  admin_button.innerHTML = content;
}

function openOverlay(){
  document.getElementById("overlay").style.top = "0vh";
}

function closeOverlay() {
  document.getElementById("overlay").style.top = "100vh";
}
function displayMenu() {
  let menu = document.getElementById("edit-profile-menu");
  menu.style.display = "block";
  
}
