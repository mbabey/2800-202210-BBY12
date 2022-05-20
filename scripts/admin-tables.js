'use strict';

docLoaded(() => {
  getData('/get-all-admins', (adminData) => {
    createAdminArray(adminData);
  });
  getData('/get-all-users', (userData) => {
    populateUserCardData(userData);
    initUpdateListeners();
  });
  addUniversalListeners();
  searchUser();
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
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

const adminArray = [];

function createAdminArray(adminData) {
  for (let i = 0; i < adminData.rows.length; i++) {
    adminArray.push(adminData.rows[i].username);
  }
}

function populateUserCardData(userData) {
  // USER CARD CREATED HERE
  let userCard = makeUserCard(userData);
  document.getElementById("user-list").innerHTML = userCard;
}

function repopulateUserCardData() {
  getData('/get-all-users', (userData) => {
    populateUserCardData(userData);
    initCardEventListeners();
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
      repopulateUserCardData();
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

let user = null; // Global variable to store name of user being manipulated by DOM.

const lengthViewProfile = 13; // Length of 'view-profile '. Used for getting username from class name.
const lengthDeleteUser = 12; // Length of 'delete-user '. Used for getting username from class name.
const lengthRemoveAdmin = 13; // Length of 'remove-admin '. Used for getting username from class name.
const lengthMakeAdmin = 11; // Length of 'make-admin '. Used for getting username from class name.

function initCardEventListeners() {
  // Initialize event listeners for buttons in card options menu.
  document.querySelectorAll(".view-profile").forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
      user = e.target.className.slice(lengthViewProfile); // Get username out of class name
      window.location.replace('/users/' + user);
    });
  });
  document.querySelectorAll(".delete-user").forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
      user = e.target.className.slice(lengthDeleteUser); // Get username out of class name
      document.getElementById("popup-header-username").innerHTML = user;
      document.getElementById("popup-delete").style.display = 'block';
    });
  });
  document.querySelectorAll('.remove-admin').forEach((removeAdminButton) => {
    removeAdminButton.addEventListener('click', (e) => {
      user = e.target.className.slice(lengthRemoveAdmin); // Get username out of class name
      document.getElementById('popup-admin-header-username').innerHTML = user;
      document.getElementById('popup-admin-delete').style.display = 'block';
    });
  });
  document.querySelectorAll('.make-admin').forEach((makeAdminButton) => {
    makeAdminButton.addEventListener('click', (e) => {
      user = e.target.className.slice(lengthMakeAdmin); // Get username out of class name
      document.getElementById('popup-make-admin-header-username').innerHTML = user;
      document.getElementById('popup-make-admin').style.display = 'block';
    });
  });
}

function initUpdateListeners() {
  initCardEventListeners();
  // Event listener to confirm user deletion.
  document.getElementById("popup-confirm-delete").addEventListener('click', () => {
    document.getElementById("popup-delete").style.display = 'none';
    let userInput = {
      username: user
    };
    sendData(userInput, '/delete-user', (response) => {
      handleDeleteConditions(response, user);
      document.getElementById("popup-okay").style.display = 'block';
      repopulateUserCardData();
    });
  });

  // Event listener to confirm admin removal.
  document.getElementById("popup-admin-confirm-delete").addEventListener('click', () => {
    document.getElementById("popup-admin-delete").style.display = 'none';
    let userInput = {
      username: user
    };
    sendData(userInput, '/delete-admin', (response) => {
      handleRemoveAdminConditions(response, user);
      document.getElementById("popup-okay").style.display = 'block';
      repopulateUserCardData();
    });
  });

  // Event listener to confirm admin addition.
  document.getElementById("popup-make-admin-confirm").addEventListener('click', () => {
    document.getElementById("popup-make-admin").style.display = 'none';
    let userInput = {
      username: user
    };
    console.log(user);
    sendData(userInput, '/make-admin', (response) => {
      handleMakeAdminConditions(response, user);
      document.getElementById("popup-okay").style.display = 'block';
      getData('/get-all-users', (userData) => {
        adminArray.push(user);
        populateUserCardData(userData);
        initCardEventListeners();
      });
    });
  });
}

function addUniversalListeners() {
  // Event listener to close delete user pop up
  document.getElementById("popup-negate-delete").addEventListener('click', () => {
    document.getElementById("popup-delete").style.display = 'none';
    user = null;
  });
  // Event listener to close admin remove pop up
  document.getElementById("popup-admin-negate-delete").addEventListener('click', () => {
    document.getElementById("popup-admin-delete").style.display = 'none';
    user = null;
  });
  // Event listener to close the make admin pop up
  document.getElementById('popup-make-admin-negate').addEventListener('click', () => {
    document.getElementById('popup-make-admin').style.display = 'none';
    user = null;
  });
  // Event listener to close the okay pop up
  document.getElementById("popup-okay-button").addEventListener('click', () => {
    document.getElementById("popup-okay").style.display = 'none';
    user = null;
  });
}

function handleDeleteConditions(response, user) {
  // I don't know why I need to do it this way but it doesn't work when I bare back the conditionals.
  let adminDeleted = response.adminX && response.userX && !response.finalAdmin && !response.finalUser;
  let userDeleted = !response.adminX && response.userX && !response.finalAdmin && !response.finalUser;
  let lastAdmin = !response.adminX && !response.userX && response.finalAdmin && !response.finalUser;
  let lastUser = !response.adminX && !response.userX && !response.finalAdmin && response.finalUser;
  let notExists = !response.adminX && !response.userX && !response.finalAdmin && !response.finalUser;
  let isSelf = response.adminX && response.userX && response.finalAdmin && response.finalUser;

  let message = document.querySelector('#query-response-message');

  if (adminDeleted)
    message.innerHTML = 'Administrator ' + user + ' deleted.';
  else if (userDeleted)
    message.innerHTML = 'User ' + user + ' deleted.';
  else if (lastAdmin)
    message.innerHTML = 'Administrator ' + user + ' could not be deleted; ' + user + ' is the only administrator.';
  else if (lastUser)
    message.innerHTML = 'User ' + user + ' could not be deleted; ' + user + ' is the only user.';
  else if (notExists)
    message.innerHTML = 'User ' + user + ' not found.';
  else if (isSelf)
    message.innerHTML = 'Gro-Operate does not want you to delete yourself (it will get better).';
  else
    message.innerHTML = 'User ' + user + ' could not be deleted.';
}

function handleRemoveAdminConditions(response, user) {
  let adminDeleted = response.adminX && !response.finalAdmin;
  let lastAdmin = !response.adminX && response.finalAdmin;
  let isSelf = response.adminX && response.finalAdmin;
  let notExists = !response.adminX && !response.finalAdmin;

  let message = document.querySelector('#query-response-message');

  if (adminDeleted) {
    removeItemOnce(adminArray, user); // Remove user name from local list of admins.
    message.innerHTML = 'Administrator privileges revoked for ' + user + '.';
  } else if (lastAdmin)
    message.innerHTML = 'Administrator ' + user + ' could not have their privileges revoked; ' + user + ' is the only administrator.';
  else if (isSelf)
    message.innerHTML = 'Cannot revoke your own admin privileges.';
  else if (notExists)
    message.innerHTML = 'Administrator ' + user + ' not found.';
  else
    message.innerHTML = 'Administrator ' + user + ' could not have their privileges revoked.';
}

// Function from https://stackoverflow.com/a/5767357
function removeItemOnce(arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function handleMakeAdminConditions(response, user) {
  let message = document.querySelector('#query-response-message');

  if (response.adminCreated)
    message.innerHTML = user + ' was promoted to an administrator.';
  else
    message.innerHTML = user + ' could not be promoted to an administrator';
}

function makeUserCard(userData) {
  let userCard = "<div class='user-card-group'>";
  for (let i = 0; i < userData.rows.length; i++) {
    // Determine if the current card belongs to the user.
    let isUser = (userData.rows[i].username == userData.thisUser) ? true : false;
    // Determine if current card belongs to an admin. 
    let isAdmin = false;
    adminArray.forEach((adminName) => {
      if (userData.rows[i].username == adminName)
        isAdmin = true;
    });
    if (isAdmin) // Add a class if the card belongs to an admin.
      userCard += `<div class="user-card-wrapper admin-card">`;
    else
      userCard += `<div class="user-card-wrapper">`;
    userCard += ` 
      <input type="checkbox" class="user-card-menu-toggle"/>
      <div class='user-card'>
        <div class='user-card-info'>`
    if (isUser) // Add an indicator if the card belongs to the current user.
      userCard += `<span class='user-card-username'>${userData.rows[i].username} <small>(you)</small></span>`
    else
      userCard += `<span class='user-card-username'>${userData.rows[i].username}</span>`
    userCard += `
          <span class='user-card-cName'>${userData.rows[i].cName}</span>
          <span class='user-card-bType'>${userData.rows[i].bType}</span>
          <span class='user-card-fName'>${userData.rows[i].fName} </span>
          <span class='user-card-lName'>${userData.rows[i].lName}</span>
        </div>
        <div class='arrow'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="20" width="20">
            <path fill="currentColor" d="M32.75 44 12.75 24 32.75 4 35.55 6.85 18.4 24 35.55 41.15Z"/>
          </svg>
          <span class="tooltip-text">More options</span>
        </div>
      </div>
      <div class="user-card-options">
        <button class="view-profile ${userData.rows[i].username}" type="button">View profile</button>
        <button class="delete-user ${userData.rows[i].username}" type="button">Delete User</button>
        <button class="edit-user" type="button">Edit User</button>`;
    if (isAdmin) // Add a 'Remove admin' button if the card belongs to an admin.
      userCard += `<button class="remove-admin ${userData.rows[i].username}" type="button">Remove Admin</button>`;
    else // Otherwise, add a 'Make admin' button.
      userCard += `<button class="make-admin ${userData.rows[i].username}" type="button">Make Admin</button>`
    userCard += `</div></div>`;
  }
  userCard += "</div>";
  return userCard;
}
