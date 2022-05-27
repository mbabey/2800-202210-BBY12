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
 * @param {function} callback - the callback function to run
 */
async function getData(callback) {
  try {
    let response = await fetch('/get-other-user?' + new URLSearchParams(window.location.search), {
      method: 'GET',
    });
    if (response.status == 200) {
      response = await response.text();
      response = JSON.parse(response);
      callback(response);
    }
  } catch (err) {
    console.log(err);
  }
}
