'use strict';

docLoaded(() => {
  getData('/get-all-admins', getAdmins);
  getData('/get-all-users', (userData) => {
    popUserData(userData);
    initUserDeletion();
  });
  makeCardsClickable();
  searchUser();
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

const adminArray = [];

function getAdmins(adminData) {
  for (let i = 0; i < adminData.rows.length; i++) {
    adminArray.push(adminData.rows[i].username);
  }
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
    console.log(err);
  }
}

async function getData(path, callback) {
  try {
    let response = await fetch(path, {
      method: 'GET'
    });
    response = await response.text();
    response = JSON.parse(response);
    callback(response);
  } catch (err) {
    console.log(err);
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

function searchUser() {
  document.querySelector('#search-user-button').addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector('#search-error-message').innerHTML = '';
    let userSearchInput = document.querySelector('#search-user-input').value;
    if (userSearchInput != "") {
      let userSearchInputData = { username: userSearchInput }
      sendData(userSearchInputData, '/search-user', showSearchResults);
    } else {
      getData('/get-all-users', popUserData);
    }
    document.querySelector('#search-user-input').value = '';
  });
}

function showSearchResults(searchData) {
  // USER CARD CREATED HERE FOR SEARCH RESULT
  if (searchData.status == 'fail') {
    document.getElementById("user-list").innerHTML = '';
    document.querySelector('#search-error-message').innerHTML = 'No users found.';
  } else {
    let userCard = makeUserCard(searchData);
    document.getElementById("user-list").innerHTML = userCard;
  }
}

const cardArray = [];

function makeUserCard(userData) {
  let userCard = "<div class='user-card-group'>";
  for (let i = 0; i < userData.rows.length; i++) {
    cardArray.push(userData.rows[i].username);
    adminArray.forEach((adminName) => {
      if (userData.rows[i].username == adminName) {
        userCard += `<div class="user-card-wrapper admin-card">`;
      } else {
        userCard += `<div class="user-card-wrapper">`;
      }
    });
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
    </div>
       `);
  }
  userCard += "</div>";
  return userCard;
}

function refreshSearch() {
  window.location.reload();
}
