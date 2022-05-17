'use strict';

docLoaded(() => {
  getUserData();
  getAdminData();
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
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

function popAdminData(adminData) {
  // ADMIN TABLE CREATED HERE
  let adminCard = "<div class='admin-card-group'>";
  for (let i = 0; i < adminData.rows.length; i++) {
    adminCard += (`
    <div class='admin-card'>
    <a class='close' href='#'>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 511.991 511.991" style="enable-background:new 0 0 511.991 511.991;" xml:space="preserve" width="512" height="512">
        <g>
          <path fill="currentColor" d="M286.161,255.867L505.745,36.283c8.185-8.474,7.951-21.98-0.523-30.165c-8.267-7.985-21.375-7.985-29.642,0   L255.995,225.702L36.411,6.118c-8.475-8.185-21.98-7.95-30.165,0.524c-7.985,8.267-7.985,21.374,0,29.641L225.83,255.867   L6.246,475.451c-8.328,8.331-8.328,21.835,0,30.165l0,0c8.331,8.328,21.835,8.328,30.165,0l219.584-219.584l219.584,219.584   c8.331,8.328,21.835,8.328,30.165,0l0,0c8.328-8.331,8.328-21.835,0-30.165L286.161,255.867z"/>
        </g>
    </a>
    <div class='admin-card-header'>
      <div class='admin-card-avatar-background'>
        <img id='admin-card-avatar' src="./avatars/${userData.rows[i].profilePic}" alt='Profile Picture'>
      </div>
    </div>
    <div class='admin-card-info'>
      <h3 class='admin-card-username'>${adminData.rows[i].username}</h3>
    </div></div>
    `);

    // Placeholder image path for image
    // ./avatars/Logo.png' alt='Profile Picture'></div>

  }
  adminCard += "</div>";
  document.getElementById("admin-list").innerHTML = adminCard;
}

function popUserData(userData) {
  // USER CARD CREATED HERE
  let userCard = "<div class='user-card-group'>";
  for (let i = 0; i < userData.rows.length; i++) {
    userCard += (
      "<div class='user-card'>" +
      "<div class='user-card-header'>" +
      "<div class='user-card-avatar-background'><img id='user-card-avatar' src='"
      // + "./avatars/" + userData.rows[i].profilePic + "' alt='Profile Picture'></div>"
      +
      "./avatars/Logo.png' alt='Profile Picture'></div></div>" +
      "<div class='user-card-info'>" +
      "<h3 class='user-card-username'>" + userData.rows[i].username +
      "</h3><span class='user-card-business-name'>" + userData.rows[i].cName + " | " +
      "</span><span class='user-card-first-name'>" + userData.rows[i].fName + " " +
      "</span><span class='user-card-last-name'>" + userData.rows[i].lName + "</span>" +
      "</div></div>"
    );
  }
  userCard += "</div>";
  document.getElementById("user-list").innerHTML = userCard;
}


async function getAdminData() {
  try {
    let adminData = await fetch('/get-all-admins', {
      method: 'GET'
    });
    adminData = await adminData.text();
    adminData = JSON.parse(adminData);
    if (adminData.status == "success") {
      popAdminData(adminData);
      initAdminDeletion();
    }
  } catch (err) {
    if (err) throw "Cannot get admins."
  }
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

      if (adminDeleted)
        document.querySelector('#status-2').innerHTML = 'Administrator ' + user + ' deleted.';
      else if (userDeleted)
        document.querySelector('#status-2').innerHTML = 'User ' + user + ' deleted.';
      else if (lastAdmin)
        document.querySelector('#error-message-2').innerHTML = 'Administrator ' + user + ' could not be deleted; ' + user + ' is the only administrator.';
      else if (lastUser)
        document.querySelector('#error-message-2').innerHTML = 'User ' + user + ' could not be deleted; ' + user + ' is the only user.';
      else if (notExists)
        document.querySelector('#error-message-2').innerHTML = 'User ' + user + ' not found.';
      else if (isSelf)
        document.querySelector('#error-message-2').innerHTML = 'Gro-Operate does not want you to delete yourself (it will get better).';
      else
        document.querySelector('#error-message-2').innerHTML = 'User ' + user + ' could not be deleted.';
    });

    document.getElementById("user-username").value = "";

    // //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
    // window.setTimeout(() => { location.reload(); }, 1000);
  });
}

function initAdminDeletion() {
  document.getElementById("delete-admin").addEventListener("click", () => {
    let admin = document.getElementById("admin-username").value;
    let adminInput = {
      username: admin
    };

    sendData(adminInput, '/delete-admin', (response) => {
      let adminDeleted = response.adminX && !response.finalAdmin;
      let lastAdmin = !response.adminX && response.finalAdmin;
      let notExists = !response.adminX && !response.finalAdmin;
      let isSelf = response.adminX && response.finalAdmin;

      if (adminDeleted)
        document.querySelector('#status').innerHTML = 'Administrator privileges revoked for user ' + admin + '.';
      else if (lastAdmin)
        document.querySelector('#error-message').innerHTML = 'Administrator ' + admin + ' could not have their privileges revoked; ' + admin + ' is the only administrator.';
      else if (notExists)
        document.querySelector('#error-message').innerHTML = 'Administrator ' + admin + ' not found.';
      else if (isSelf)
        document.querySelector('#error-message').innerHTML = 'Cannot remove your own administrator privileges.';
      else
        document.querySelector('#error-message').innerHTML = 'Administrator ' + admin + ' could not have their privileges revoked.';
    });

    document.getElementById("admin-username").value = "";

    // //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
    // window.setTimeout(() => { location.reload(); }, 1000);
  });
}

async function sendData(data, path, printMessage) {
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
    printMessage(response);
  } catch (err) {
    if (err) throw err;
  }
}