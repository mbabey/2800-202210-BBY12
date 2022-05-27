'use strict';
docLoaded(() => {

  /** The information currently entered in the profile information. */
  const bizInfo = {
    cName: document.querySelectorAll('.business-name-block'),
    fName: document.querySelectorAll('.business-owner-fname-block'),
    lName: document.querySelectorAll('.business-owner-lname-block'),
    bType: document.querySelectorAll('.business-type-block'),
    email: document.querySelectorAll('.business-email-block'),
    phoneNo: document.querySelectorAll('.business-phone-block'),
    location: document.querySelectorAll('.business-location-block'),
    description: document.querySelectorAll('.business-description-block')
  };

  /** The default values for the profile information. */
  const bizInfoDefaults = {
    cName: "Business Name",
    fName: "First Name",
    lName: "Last Name",
    bType: "Business Type",
    email: "email@business.gov",
    phoneNo: "(###)-###-####",
    location: "Location",
    description: "Description"
  };
  
  const editButton = document.getElementById("edit-button");
  const saveButton = document.getElementById("save-button");
  
  getData(popThaSpots);
  
  /**
   * popThaSpots. Populates the profile with information from the database.
   * @param {Object} data - the data with which to populate the profile.
   */
  function popThaSpots(data) {
    document.querySelector("#profile-picture").src = "./avatars/" + data[0].profilePic;
    for (const [key, value] of Object.entries(bizInfo)) {
      value.forEach((element) => {
        element.innerHTML = (data[0][key] != undefined && data[0][key] != null) ? data[0][key] : bizInfoDefaults[key];
      });
    }
  }

  // Add event listeners to edit buttons on the page.
  document.getElementById("edit-button").addEventListener("click", (event) => {
    for (const [key, value] of Object.entries(bizInfo)) {
      clickEdit(value[0]);
    }
    document.getElementById("edit-status").innerHTML = "";
    editButton.innerHTML = "";
    saveButton.innerHTML = "Save";
    event.preventDefault();
  });

  // Add event listeners to save buttons on the page.
  document.getElementById("save-button").addEventListener("click", async () => {
    let dataToSend = {};
    for (const [key, value] of Object.entries(bizInfo)) {
      saved(value[0]);
      if (!checkEmpty(value[0].innerHTML)) {
        value[0].innerHTML = bizInfoDefaults[key];
      }
      dataToSend[key] = value[0].innerHTML;
    }
    document.getElementById("edit-status").innerHTML = "";
    editButton.innerHTML = "Edit Profile";
    saveButton.innerHTML = "";
    sendData(dataToSend);
    location.reload();
  });
});

/**
 * sendData. Sends information to a specified path.
 * @param {Object} data - the data to send to the server
 */
async function sendData(data) {
  try {
    await fetch('/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.log('account.js\n', err);
  }
}

/**
 * getData. Retrieve information from a specified path and then 
 * execute a callback with that information.
 * @param {function} callback - the callback function to run
 */
async function getData(callback) {
  try {
    let response = await fetch('/get-user', {
      method: 'GET'
    });
    if (response.status == 200) {
      response = await response.text();
      response = JSON.parse(response);
      callback(response);
    }
  } catch (err) {
  }
}

/**
 * saved. Sets an element's content to no longer be editable and changes the style
 * to reflect that change.
 * @param {DOM element} element - the element to be made editable 
 */
function saved(element) {
  element.contentEditable = false;
  element.style.color = '#ffd500';
};

/**
 * clickEdit. Makes a clicked element's content editable and changes the style 
 * to reflect that change.
 * @param {DOM element} element - the element to be made editable. 
 */
function clickEdit(element) {
  element.contentEditable = true;
  element.style.color = "white";
  element.style.borderRadius = "5px";
  element.style.padding = "10px";
  element.style.backgroundColor = "var(--primary-dark)";
}

/**
 * checkEmpty. Determines whether the input data is empty.
 * @param {String} data - the data to determine emptiness for.
 * @returns true if data is empty, false otherwise.
 */
function checkEmpty(data) {
  let checkEmpty = data.trim();
  let checkSpace = data.replace('/&nbsp;/g', '');
  let checkEnter = data.replace('/<div><br></div>/g', '');
  if (checkEmpty == '' || checkSpace.trim() == '' || checkEnter.trim() == '') {
    return false;
  } else {
    return true;
  }
};

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
