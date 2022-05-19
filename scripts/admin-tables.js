'use strict';

docLoaded(() => {
  getUserData();
  // getAdminData();
  makeCardsClickable();
  searchUser();
  // searchAdmin();
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

function makeCardsClickable() {
  document.querySelectorAll('.view-profile').forEach((card) => {
    card.addEventListener('click', () => {
      window.redirect('#');
    });
  });
}

async function sendData(data, path, callback) {
  try {
    let response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    response = await response.text();
    response = JSON.parse(response);
    callback(response);
  } catch (err) {
    if (err) throw err;
  }
}

async function getUserData() {
  try {
    let userData = await fetch('/get-all-users', {
      method: 'GET'
    });
    userData = await userData.text();
    userData = JSON.parse(userData)
    if (userData.status == "success") {
      popUserData(userData);
      initUserDeletion();
    }
  } catch (err) {
    if (err) throw "Cannot get users.";
  }
}

function popUserData(userData) {
  // USER CARD CREATED HERE
  let userCard = makeUserCard(userData);
  document.getElementById("user-list").innerHTML = userCard;
}

function initUserDeletion() {
  document.getElementById("delete-user").addEventListener("click", () => {
    let user = document.getElementById("user-username").value;
    let userInput = {
      username: user
    };

    sendData(userInput, '/delete-user', (response) => {
      // I don't know why I need to do it this way but it doesn't work when I bare back the conditionals.
      let adminDeleted = response.adminX && response.userX && !response.finalAdmin && !response.finalUser;
      let userDeleted = !response.adminX && response.userX && !response.finalAdmin && !response.finalUser;
      let lastAdmin = !response.adminX && !response.userX && response.finalAdmin && !response.finalUser;
      let lastUser = !response.adminX && !response.userX && !response.finalAdmin && response.finalUser;
      let notExists = !response.adminX && !response.userX && !response.finalAdmin && !response.finalUser;
      let isSelf = response.adminX && response.userX && response.finalAdmin && response.finalUser;

      let message = document.querySelector('#user-error-message').innerHTML;

      if (adminDeleted)
        message = 'Administrator ' + user + ' deleted.';
      else if (userDeleted)
        message = 'User ' + user + ' deleted.';
      else if (lastAdmin)
        message = 'Administrator ' + user + ' could not be deleted; ' + user + ' is the only administrator.';
      else if (lastUser)
        message = 'User ' + user + ' could not be deleted; ' + user + ' is the only user.';
      else if (notExists)
        message = 'User ' + user + ' not found.';
      else if (isSelf)
        message = 'Gro-Operate does not want you to delete yourself (it will get better).';
      else
        message = 'User ' + user + ' could not be deleted.';
    });

    document.getElementById("user-username").value = "";

    // //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
    // window.setTimeout(() => { location.reload(); }, 1000);
  });
}

async function getAdminData() {
  try {
    let adminData = await fetch('/get-all-admins', {
      method: 'GET'
    });
    adminData = await adminData.text();
    adminData = JSON.parse(adminData);
    if (adminData.status == "success") {

    }
  } catch (err) {
    if (err) throw err;
  }
}

function searchUser() {
  document.querySelector('#search-user').addEventListener("click", function (e) {
    e.preventDefault();
    let userSearchInput = { username: document.querySelector('.search-input').value }
    sendData(userSearchInput, '/search-user', popUserCard);
    document.querySelector('.search-input').value = "";
    document.querySelector('#user-username').value = userSearchInput.username;
    document.querySelector('#delete-user').style.display = 'inline';
  });
}

function popUserCard(searchData) {
  // USER CARD CREATED HERE FOR SEARCH RESULT
  let userCard = makeUserCard(searchData);
  document.getElementById("search-results").innerHTML = userCard;
}

// Hide/make visible search block referenced from https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
function toggleDropDown() {
  let searchDropDown = document.querySelector("#user-search-dropdown");
  if (searchDropDown.style.display === "flex") {
    searchDropDown.style.display = "none";
  } else {
    searchDropDown.style.display = "flex";
  }
}

function toggleSearchButton() {
  let searchButton = document.querySelector("#search-user");
  let clearSearch = document.querySelector("#search-results");
  let clearButton = document.querySelector('#search-refresh');
  if (searchButton.innerHTML === "Search") {
    searchButton.style.display = "none";
    clearSearch.style.display = "block";
    clearButton.style.display = "block";
  } else {
    clearSearch.style.display = "none";
    searchButton.innerHTML = "Search";
    errMsg.style.display = "block";
  }
}

const cardArray = [];

function makeUserCard(userData) {
  let userCard = "<div class='user-card-group'>";
  for (let i = 0; i < userData.rows.length; i++) {
    cardArray.push(userData.rows[i].username);
    userCard += (`
    <input type="checkbox" class="user-card-menu-toggle"/>
    <div class='user-card'>
     <div class='user-card-info'>
       <span class='user-card-username'>${userData.rows[i].username}</span>
       <span class='user-card-cName'>${userData.rows[i].cName}</span>
       <span class='user-card-bType'>${userData.rows[i].bType}</span>
       <span class='user-card-fName'>${userData.rows[i].fName} </span>
       <span class='user-card-lName'>${userData.rows[i].lName}</span>
      </div>
      <a class='close' id='delete-user-account' href='#'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="20" width="20">
      <path fill="currentColor" d="M32.75 44 12.75 24 32.75 4 35.55 6.85 18.4 24 35.55 41.15Z"/>
      </svg>
      <span class="tooltip-text">More options</span>
      </a>
      </div>
      <div class="user-card-options">
        <button class="view-profile" type="button">View profile</button>
        <button class="delete-user" type="button">Delete User</button>
        <button class="edit-user" type="button">Edit User</button>
      </div>
       `);
      }
      userCard += "</div>";
      return userCard;
    }
    
function refreshSearch() {
  window.location.reload();
}
