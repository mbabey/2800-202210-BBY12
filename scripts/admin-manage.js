'use strict';

/**
 * Getting the admin table and users table from the server (from the database)
 *     and populate the user cards, and adding functionality to searching users
 */
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
 * sendData. Sends information to a specified path and then 
 * execute a callback with the response to that information.
 * @param {Object} data - the data to send to the server
 * @param {String} path - the post path to server
 * @param {function} callback - the callback function to run
 */
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
    response = await response.text();
    response = JSON.parse(response);
    callback(response);
  } catch (err) {
    console.log(err);
  }
}

/** The array in which to store the admin users. */
const adminArray = [];

/**
 * createAdminArray. Stores the usernames of administators in the global adminArray.
 * @param {Object} adminData - the data object containing the list of administrators.
 */
function createAdminArray(adminData) {
  for (let i = 0; i < adminData.rows.length; i++) {
    adminArray.push(adminData.rows[i].username);
  }
}

/**
 * populateUserCardData. Populate the user cards with the user data.
 * @param {Object} userData - the user data from the server (database)
 */
function populateUserCardData(userData) {
  let userCard = makeUserCard(userData);
  document.getElementById("user-list").innerHTML = userCard;
}

/**
 * repopulateUserCardData. Populate user card data and add event listeners when the DOM is reloaded.
 */
function repopulateUserCardData() {
  getData('/get-all-users', (userData) => {
    populateUserCardData(userData);
    initCardEventListeners();
  });
}

/**
 * searchUser. Adds an event listener to the search button on the page. Clicking the search 
 * button returns data from the server, and then populates the user data based on the query result.
 */
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

/**
 * showSearchResults. Shows the search results on the DOM.
 * @param {Object} searchData - the search query results
 */
function showSearchResults(searchData) {
  if (searchData.status == 'fail') {
    document.getElementById("user-list").innerHTML = '';
    document.querySelector('#search-error-message').innerHTML = 'No users found.';
  } else {
    let userCard = makeUserCard(searchData);
    document.getElementById("user-list").innerHTML = userCard;
  }
}

/** Global variable to store name of user being manipulated by DOM. */
let user = null;

/** The edit user form inputs. */
const editUserFormInputs = {
  emailInput: document.querySelector('input[name=\'email\']'),
  emailVerifyInput: document.querySelector('input[name=\'emailVerify\']'),
  companyNameInput: document.querySelector('input[name=\'cName\']'),
  bizTypeInput: document.querySelector('input[name=\'bType\']'),
  firstNameInput: document.querySelector('input[name=\'fName\']'),
  lastNameInput: document.querySelector('input[name=\'lName\']'),
  phoneNumInput: document.querySelector('input[name=\'phoneNo\']'),
  locationInput: document.querySelector('input[name=\'location\']'),
  descriptionInput: document.querySelector('textarea[name=\'description\']')
};

/** Length of 'view-profile '. Used for getting username from class name. */ 
const lengthViewProfile = 13;

/** Length of 'delete-user '. Used for getting username from class name. */ 
const lengthDeleteUser = 12; 

/** Length of 'edit-user '. Used for getting username from class name. */ 
const lengthEditUser = 10; 

/** Length of 'remove-admin '. Used for getting username from class name. */ 
const lengthRemoveAdmin = 13; 

/** Length of 'make-admin '. Used for getting username from class name. */ 
const lengthMakeAdmin = 11; 

/**
 * initEventCardListener. Add event listeners to the admin management buttons attached to each user card.
 */
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
  document.querySelectorAll('.user-card-menu-toggle').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      if (checkbox.checked)
        e.target.parentNode.classList.add('toggled');
      else
        setTimeout(() => {
          e.target.parentNode.classList.remove('toggled');
        }, 500);
    });
  });
}

/**
 * initUpdateEventListeners. Add event listeners to user cards and to popup confirm buttons for each operation.
 */
function initUpdateListeners() {
  initCardEventListeners();

  //Event listener to confirm user deletion.
  document.getElementById("popup-confirm-delete").addEventListener('click', () => {
    document.getElementById("popup-delete").style.display = 'none';
    let userInput = { username: user };
    sendData(userInput, '/delete-user', (response) => {
      handleDeleteConditions(response, user);
      document.getElementById("popup-okay").style.display = 'block';
      repopulateUserCardData();
    });
  });

  // Event listener to confirm admin removal.
  document.getElementById("popup-admin-confirm-delete").addEventListener('click', () => {
    document.getElementById("popup-admin-delete").style.display = 'none';
    let userInput = { username: user };
    sendData(userInput, '/delete-admin', (response) => {
      handleRemoveAdminConditions(response, user);
      document.getElementById("popup-okay").style.display = 'block';
      repopulateUserCardData();
    });
  });

  // Event listener to confirm admin addition.
  document.getElementById("popup-make-admin-confirm").addEventListener('click', () => {
    document.getElementById("popup-make-admin").style.display = 'none';
    let userInput = { username: user };
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

/**
 * addUniversalListeners. Add event listeners to close the pop up boxes.
 */
function addUniversalListeners() {
  // Event listener to close delete user pop up
  document.getElementById("popup-negate-delete").addEventListener('click', () => {
    document.getElementById("popup-delete").style.display = 'none';
    user = null;
  });
  // Event listener to close edit user pop up
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

/**
 * handleDeleteConditions. Provides messages when deleting a user based on flags set by the server.
 * @param {Object} response - the response from /delete-user on server
 * @param {String} user - the username of the user being deleted.
 */
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
  document.querySelector('#query-response-message').innerHTML = message;
}

/**
 * handleRemoveAdminConditions. Provides messages when removing an admin based on flags set by the server.
 * @param {Object} response - the response from on server
 * @param {String} user - the username of the user being unmade an admin.
 */
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
  document.querySelector('#query-response-message').innerHTML = message;
}

/**
 * removeItemOnce. Remove one item from an array
 * Function from https://stackoverflow.com/a/5767357
 * @param {*[]} arr - the array to remove an item from.
 * @param {*} value - the value to remove from the array.
 */
function removeItemOnce(arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

/**
 * handleMakeAdminConditions. Provides messages when making a user an admin based on flags set by the server.
 * @param {Object} response - the response from on server
 * @param {String} user - the username of the user being made an admin.
 */
function handleMakeAdminConditions(response, user) {
  let message = (response.adminCreated) ? ' was promoted to an administrator.' : ' could not be promoted to an administrator';
  document.querySelector('#query-response-message').innerHTML = user + message;
}

/**
 * handleEditUserConditions. Provides messages when editing a user based on flags set by the server.
 * @param {Object} response - the response from on server
 * @param {String} user - the username of the user being edited.
 */
function handleEditUserConditions(response, user) {
  clearEditUserFormInputs();
  let message = (response.status == 'success') ? ' was successfully updated.' : ' could not be updated.';
  document.querySelector('#query-response-message').innerHTML = user + message;
}

/**
 * fillEditUserFormInputs. Send username, retrieve specific user data, populate the user data in the edit profile pop-up box.
 */
function fillEditUserFormInputs() {
  sendData({ username: user }, '/search-user', (response) => {
    if (response.status == 'success') {
      const filledInputsArray = [];
      populateInputField(filledInputsArray, editUserFormInputs.emailInput, response.rows[0].email);
      populateInputField(filledInputsArray, editUserFormInputs.emailVerifyInput, response.rows[0].email);
      populateInputField(filledInputsArray, editUserFormInputs.companyNameInput, response.rows[0].cName);
      populateInputField(filledInputsArray, editUserFormInputs.bizTypeInput, response.rows[0].bType);
      populateInputField(filledInputsArray, editUserFormInputs.firstNameInput, response.rows[0].fName);
      populateInputField(filledInputsArray, editUserFormInputs.lastNameInput, response.rows[0].lName);
      populateInputField(filledInputsArray, editUserFormInputs.phoneNumInput, response.rows[0].phoneNo);
      populateInputField(filledInputsArray, editUserFormInputs.locationInput, response.rows[0].location);
      populateInputField(filledInputsArray, editUserFormInputs.descriptionInput, response.rows[0].description);
      setInputLabelUp(true, filledInputsArray);
    } else {
      document.getElementById('popup-edit-block').style.display = 'none';
      document.querySelector('#query-response-message').innerHTML = 'Could not get information for ' + user + '.';
      document.getElementById('popup-okay').style.display = 'block';
    }
  });
}

/**
 * populateInputField. Populate an input field with user information. If information exists, add it to the an array.
 * @param {DOM element[]} filledInputsArray - an array to store filled inputs
 * @param {DOM element} input - the input field
 * @param {String} value - the value provided by the server
 */
function populateInputField(filledInputsArray, input, value) {
  input.value = value;
  if (value != '' && value != null)
    filledInputsArray.push(input);
}

/**
 * getEditUserFormInput. Store the user profile information into the edit user form inputs.
 * @returns the user profile information
 */
function getEditUserFormInput() {
  let userInput = {
    username: user,
    email: editUserFormInputs.emailInput.value,
    cName: editUserFormInputs.companyNameInput.value, bType: editUserFormInputs.bizTypeInput.value,
    fName: editUserFormInputs.firstNameInput.value, lName: editUserFormInputs.lastNameInput.value,
    phoneNo: editUserFormInputs.phoneNumInput.value, location: editUserFormInputs.locationInput.value,
    description: editUserFormInputs.descriptionInput.value
  };
  return userInput;
}

/**
 * clearEditUserFormInputs. Clears the edit user form inputs.
 */
function clearEditUserFormInputs() {
  editUserFormInputs.emailInput.value = "";
  editUserFormInputs.emailVerifyInput.value = "";
  editUserFormInputs.companyNameInput.value = "";
  editUserFormInputs.bizTypeInput.value = "";
  editUserFormInputs.firstNameInput.value = "";
  editUserFormInputs.lastNameInput.value = "";
  editUserFormInputs.phoneNumInput.value = "";
  editUserFormInputs.locationInput.value = "";
  editUserFormInputs.descriptionInput.value = "";
  setInputLabelUp(false, getAllFormInputAsArray(editUserFormInputs));
}

/**
 * getAllFormInputsAsArray. Store all input contents as an array
 * @param {Object} inputsObject - the inputs
 * @returns input contents as an array
 */
function getAllFormInputAsArray(inputsObject) {
  const inputsArray = [];
  for (const [key, value] of Object.entries(inputsObject)) {
    inputsArray.push(value);
  }
  return inputsArray;
}

/**
 * setInputLabelUp. Give the filled input a "filled" class based on the param boolean labelsUp.
 * @param {Boolean} labelsUp - true to set input class to 'filled', false otherwise.
 * @param {DOM element[]} inputs - an array containing the input elements 
 */
function setInputLabelUp(labelsUp, inputs) {
  inputs.forEach((input) => {
    if (labelsUp)
      input.nextElementSibling.classList.add('filled');
    else
      input.nextElementSibling.classList.remove('filled');
  });
}

/**
 * makeUserCard. Conditionally creates a user card element.
 * @param {Object} userData - the user's data from the server
 * @returns the user card HTML
 */
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
        <button class="view-profile ${userData.rows[i].username}" type="button">View Profile</button>
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
