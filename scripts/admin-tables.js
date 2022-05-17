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
  // USER CARD CREATED HERE
  let userCard = "<div class='user-card-group'>";
  for (let i = 0; i < userData.rows.length; i++) {
    userCard += (
      "<div class='user-card'>"
      + "<div class='user-card-header'>"
      + "<div class='user-card-avatar-background'><img id='user-card-avatar' src='"
      // + "./avatars/" + userData.rows[i].profilePic + "' alt='Profile Picture'></div>"
      + "./avatars/Logo.png' alt='Profile Picture'></div></div>"
      + "<div class='user-card-info'>"
      + "<h3 class='user-card-username'>" + userData.rows[i].username 
      + "</h3><span class='user-card-business-name'>" + userData.rows[i].cName + " | "
      + "</span><span class='user-card-first-name'>" + userData.rows[i].fName + " "
      + "</span><span class='user-card-last-name'>" + userData.rows[i].lName + "</span>"
      + "</div></div>"
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
      initAdminDeletion(adminData);
    }
  } catch (err) {
    if (err) throw "Cannot get admins."
  }
}

function popAdminData(adminData) {
  // ADMIN TABLE CREATED HERE
  let adminCard = "<div class='admin-card-group'>";
  for (let i = 0; i < adminData.rows.length; i++) {
    adminCard += (
      "<div class='admin-card'>"
      + "<div class='admin-card-header'>"
      + "<div class='admin-card-avatar-background'><img id='admin-card-avatar' src='"
      // + "./avatars/" + userData.rows[i].profilePic + "' alt='Profile Picture'></div>"
      + "./avatars/Logo.png' alt='Profile Picture'></div></div>"
      + "<div class='admin-card-info'>"
      + "<h3 class='admin-card-username'>" + adminData.rows[i].username + "</h3>"
      + "</div></div>"
    );
  }
  adminCard += "</div>";
  document.getElementById("admin-list").innerHTML = adminCard;
}

function initUserDeletion(userData) {
  document.getElementById("delete-user").addEventListener("click", (e) => {
    if (userData.length != 1) { // If user is not the last user.
      // Delete them
      let userInput = { 
        username: document.getElementById("user-username").value 
      };

      sendData(userInput, '/delete-user', (response) => {
        if (response.status == 'success') {
          document.querySelector('#status-2').innerHTML = 'User deleted';
        } else {
          document.querySelector('#error-message-2').innerHTML = 'User could not be deleted';
        }
      });
      
      document.getElementById("user-username").value = "";

      // //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
      // window.setTimeout(() => { location.reload(); }, 1000);
    } else { // If user is the last user
      // Display message, do not delete
      document.querySelector("#error-message-2").innerHTML = "Last user cannot be deleted";
    }
  });
}



function initAdminDeletion(adminData) {
  document.getElementById("delete-admin").addEventListener("click", (e) => {
    if (adminData.length != 1) { // If admin is not the last admin.
      // Delete them
      let adminInput = { username: document.getElementById("admin-username").value };
      
      sendData(adminInput, '/delete-admin', (response) => {
        if (response.status == 'success') {
          document.querySelector('#status').innerHTML = 'Admin removed';
        } else {
          document.querySelector('#error-message').innerHTML = 'Admin could not be deleted';
        }
      });
      
      // Display message
      document.getElementById("status").innerHTML = "User successfully deleted as admin.";
      document.getElementById("admin-username").value = "";

      // //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
      // window.setTimeout(() => { location.reload(); }, 1000);
    } else { // If admin is the last admin.
      // Display message, do not delete
      document.querySelector("#error-message").innerHTML = "Last admin cannot be deleted";
    }
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
