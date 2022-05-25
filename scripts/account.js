'use strict';
docLoaded(() => {
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

  const bizInfoDefaults = {
    cName: "Enter business name here",
    fName: "first name",
    lName: "last name",
    bType: "Enter business type",
    email: "Enter email",
    phoneNo: "Enter phone number",
    location: "Enter location",
    description: "Enter description"
  };

  let edit_button = document.getElementById("edit-button");
  let save_button = document.getElementById("save-button");

  async function getData() {
    try {
      let response = await fetch('/get-user', {
        method: 'GET'
      });
      if (response.status == 200) {
        let data = await response.text();
        popThaSpots(JSON.parse(data));
      }
    } catch (err) {
    }
  }
  getData();

  function popThaSpots(data) {
    document.querySelector("#profile-picture").src = "./avatars/" + data[0].profilePic;
    for (const [key, value] of Object.entries(bizInfo)) {
      value.forEach((element) => {
        element.innerHTML = (data[0][key] != undefined && data[0][key] != null) ? data[0][key] : '';
      });
    }
  }

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

  function clickEdit(section) {
    section.contentEditable = true;
    section.style.color = "#2c598e";
    section.style.borderRadius = "5px";
    section.style.padding = "10px";
    section.style.backgroundColor = "rgb(246, 255, 179)";
  }

  document.getElementById("edit-button").addEventListener("click", (event) => {
    for (const [key, value] of Object.entries(bizInfo)) {
      clickEdit(value);
    }

    document.getElementById("edit-status").innerHTML = "";
    edit_button.innerHTML = "";
    save_button.innerHTML = "Save";
    event.preventDefault();
  });

  function saved(data) {
    data.contentEditable = false;
    data.style.color = '#ffd500';
  };

  document.getElementById("save-button").addEventListener("click", async (event) => {
    let dataToSend = {};
    for (const [key, value] of Object.entries(bizInfo)) {
      saved(value);
      if (!checkEmpty(value.innerHTML)) {
        value.innerHTML = bizInfoDefaults[key];
      }
      dataToSend[key] = value.innerHTML;
    }
    dataToSend["username"] = new URLSearchParams(document.location.search).get("user");

    document.getElementById("edit-status").innerHTML = "";
    edit_button.innerHTML = "Edit Profile";
    save_button.innerHTML = "";

    console.log(dataToSend);
    sendData(JSON.stringify(dataToSend));
    location.reload();
  });
});

async function sendData(data) {
  try {
    console.log(data);
    await fetch('/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    });
  } catch (err) {
    console.log(err);
  }
}

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}
