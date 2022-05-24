'use strict';

docLoaded(() => {
  getData('/get-all-admins', (adminData) => {
    createAdminArray(adminData);
    getData('/get-all-users', (userData) => {
      populateUserCardData(userData);
      initUpdateListeners();
    });
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
      let userSearchInputData = { username: userSearchInput };
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

const emailInput = document.querySelector('input[name=\'email\']');
const emailVerifyInput = document.querySelector('input[name=\'emailVerify\']');
const companyNameInput = document.querySelector('input[name=\'cName\']');
const bizTypeInput = document.querySelector('input[name=\'bType\']');
const firstNameInput = document.querySelector('input[name=\'fName\']');
const lastNameInput = document.querySelector('input[name=\'lName\']');
const phoneNumInput = document.querySelector('input[name=\'phoneNo\']');
const locationInput = document.querySelector('input[name=\'location\']');
const descriptionInput = document.querySelector('textarea[name=\'description\']');

const lengthViewProfile = 13; // Length of 'view-profile '. Used for getting username from class name.
const lengthDeleteUser = 12; // Length of 'delete-user '. Used for getting username from class name.
const lengthEditUser = 10; // Length of 'edit-user '. Used for getting username from class name.
const lengthRemoveAdmin = 13; // Length of 'remove-admin '. Used for getting username from class name.
const lengthMakeAdmin = 11; // Length of 'make-admin '. Used for getting username from class name.


function initCardEventListeners() {
  // Initialize event listeners for buttons in card options menu.
  document.querySelectorAll(".view-profile").forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
      user = e.target.className.slice(lengthViewProfile); // Get username out of class name
      window.location.replace('/users?user=' + user);
    });
  });
  document.querySelectorAll(".delete-user").forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
      user = e.target.className.slice(lengthDeleteUser); // Get username out of class name
      document.getElementById("popup-header-username").innerHTML = user;
      document.getElementById("popup-delete").style.display = 'block';
    });
  });
  document.querySelectorAll('.edit-user').forEach((editButton) => {
    editButton.addEventListener('click', (e) => {
      user = e.target.className.slice(lengthEditUser); // Get username out of class name
      document.getElementById('popup-edit-block').style.display = 'block';
      fillEditUserFormInputs();
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

  // Event listener to confirm edit account information.
  document.getElementById('edit-submit').addEventListener('click', () => {
    document.getElementById('popup-edit-block').style.display = 'none';
    let userInput = getEditUserFormInput();
    sendData(userInput, '/admin-edit-user', (response) => {
      handleEditUserConditions(response, user);
      document.getElementById('popup-okay').style.display = 'block';
      getData('/get-all-users', (userData) => {
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
  document.getElementById('edit-negate').addEventListener('click', () => {
    document.getElementById('popup-edit-block').style.display = 'none';
    clearEditUserFormInputs();
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
  let val = 0;
  if (response.adminX) val += 8;
  if (response.finalAdmin) val += 4;
  if (response.finalUser) val += 2;
  if (response.userX) val += 1;

  let message;

  switch (val) {
    case 0: // notExists
      message = 'User ' + user + ' not found.';
      break;
    case 1: // userDeleted
      message = 'User ' + user + ' deleted.';
      break;
    case 2: // lastUser
      message = 'User ' + user + ' could not be deleted; ' + user + ' is the only user.';
      break;
    case 4: // lastAdmin
      message = 'Administrator ' + user + ' could not be deleted; ' + user + ' is the only administrator.';
      break;
    case 9: // adminDeleted
      message = 'Administrator ' + user + ' deleted.';
      break;
    case 16: // isSelf
      message = 'Gro-Operate does not want you to delete yourself (it will get better).';
      break;
    default: // Fail
      message = 'User ' + user + ' could not be deleted.';

  }
  document.querySelector('#query-response-message').innerHTML += message;
}

function handleRemoveAdminConditions(response, user) {
  let val = 0;
  if (response.adminX) val += 2;
  if (response.finalAdmin) val += 1;

  let message;
  switch (val) {
    case 0: //notExists
      message = 'Administrator ' + user + ' not found.';
      break;
    case 1: //lastAdmin
      message = 'Administrator ' + user + ' could not have their privileges revoked; ' + user + ' is the only administrator.';
      break;
    case 2: //adminDeleted
      removeItemOnce(adminArray, user); // Remove user name from local list of admins.
      message = 'Administrator privileges revoked for ' + user + '.';
      break;
    case 3: //isSelf
      message = 'Cannot revoke your own admin privileges.';
      break;
    default: // fail
      message = 'Administrator ' + user + ' could not have their privileges revoked.';
  }
  document.querySelector('#query-response-message').innerHTML += message;
}

// Function from https://stackoverflow.com/a/5767357
function removeItemOnce(arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function handleMakeAdminConditions(response, user) {
  let message = ' could not be promoted to an administrator';
  if (response.adminCreated) message = ' was promoted to an administrator.';
  document.querySelector('#query-response-message').innerHTML = user + message;
}

function handleEditUserConditions(response, user) {
  clearEditUserFormInputs();

  let message = ' could not be updated.';
  if (response.status == 'success') message = ' was successfully updated.';
  document.querySelector('#query-response-message').innerHTML = user + message;
}

function fillEditUserFormInputs() {
  sendData({ username: user }, '/search-user', (response) => {
    if (response.status = 'success') {
      emailInput.value = response.rows[0].email;
      emailVerifyInput.value = response.rows[0].email;
      companyNameInput.value = response.rows[0].cName;
      bizTypeInput.value = response.rows[0].bType;
      firstNameInput.value = response.rows[0].fName;
      lastNameInput.value = response.rows[0].lName;
      phoneNumInput.value = response.rows[0].phoneNo;
      locationInput.value = response.rows[0].location;
      descriptionInput.value = response.rows[0].description;
    } else {
      document.getElementById('popup-edit-block').style.display = 'none';
      document.querySelector('#query-response-message').innerHTML = 'Could not get information for ' + user + '.';
      document.getElementById('popup-okay').style.display = 'block';
    }
  });
}

function getEditUserFormInput() {
  let userInput = {
    username: user, 
    email: emailInput.value,
    cName: companyNameInput.value, bType: bizTypeInput.value,
    fName: firstNameInput.value, lName: lastNameInput.value,
    phoneNo: phoneNumInput.value, location: locationInput.value,
    description: descriptionInput.value
  };
  return userInput;
}

function clearEditUserFormInputs() {
  emailInput.value = "";
  emailVerifyInput.value = "";
  companyNameInput.value = "";
  bizTypeInput.value = "";
  firstNameInput.value = "";
  lastNameInput.value = "";
  phoneNumInput.value = "";
  locationInput.value = "";
  descriptionInput.value = "";
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
        <div class='user-card-info'>`;
    if (isUser) // Add an indicator if the card belongs to the current user.
      userCard += `<span class='user-card-username'>${userData.rows[i].username} <small>(you)</small></span>`;
    else
      userCard += `<span class='user-card-username'>${userData.rows[i].username}</span>`;
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
        <button class="edit-user ${userData.rows[i].username}" type="button">Edit User</button>`;
    if (isAdmin) // Add a 'Remove admin' button if the card belongs to an admin.
      userCard += `<button class="remove-admin ${userData.rows[i].username}" type="button">Remove Admin</button>`;
    else // Otherwise, add a 'Make admin' button.
      userCard += `<button class="make-admin ${userData.rows[i].username}" type="button">Make Admin</button>`;
    userCard += `</div></div>`;
  }
  userCard += "</div>";
  return userCard;
}
