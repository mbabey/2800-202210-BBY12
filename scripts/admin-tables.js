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
      initUserDeletion(userData);
    }
  } catch (err) {
    if (err) throw "Cannot get users.";
  }
}

function popUserData(userData) {
  // USER TABLE CREATED HERE
  let userTable = "<table id=\"user-table\"><tr><th>Username</th><th>First Name</th><th>Last Name</th><th>Business Name</th></tr>";
  for (let i = 0; i < userData.rows.length; i++) {
    userTable += (
      "<tr><td class=\"data-index\">" + userData.rows[i].username + "</td><td>" + userData.rows[i].fName + "</td><td>" + userData.rows[i].lName + "</td><td>" + userData.rows[i].cName + "</td></tr>"
    );
  }
  userTable += "</table>";
  document.getElementById("user-list").innerHTML = userTable;
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

function popAdminData(adminData) {
  // ADMIN TABLE CREATED HERE
  let adminTable = `<table id='admin-table'><tr><th>Username</th></tr>`;
  for (let i = 0; i < adminData.rows.length; i++) {
    adminTable += ("<tr><td class=\"data-index\">" + adminData.rows[i].username + "</td></tr>");
  }
  adminTable += "</table>";
  document.getElementById("admin-list").innerHTML = adminTable;
}

function initUserDeletion() {
  document.getElementById("delete-user").addEventListener("click", () => {
    let user = document.getElementById("user-username").value;
    let userInput = { username: user };

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
    let adminInput = { username: admin };

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    response = await response.text();
    response = JSON.parse(response);
    printMessage(response);
  } catch (err) {
    if (err) throw err;
  }
}
