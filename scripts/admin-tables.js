'use strict';

docLoaded(() => {
  async function getUserData() {
    try {
      let response = await fetch('/get-all-users', {
        method: 'GET'
      });
      if (response.status == 200) {
        let userData = await response.text();
        popUserData(JSON.parse(userData));
      }
    } catch (err) {
      throw "Cannot get users.";
    }
  }
  getUserData();

  function popUserData(userData) {
    document.getElementById("delete-user").addEventListener("click", (e) => {
      if (userData.length > 1) {
        document.getElementById("status-2").innerHTML = "User successfully deleted.";
        //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
        window.setTimeout(() => { location.reload(); }, 1000);
      } else {
        document.getElementById("status-2").innerHTML = "Last user cannot be deleted.";
      }
    });
  }

  async function getAdminData() {
    try {
      let response = await fetch('/get-all-admins', {
        method: 'GET'
      });
      if (response.status == 200) {
        let adminData = await response.text();
        popAdminData(JSON.parse(adminData));
      }
    } catch (err) {
      throw "Cannot get admins."
    }
  }
  getAdminData();

  function popAdminData(adminData) {
    document.getElementById("delete-admin").addEventListener("click", (e) => {
      if (adminData.length > 1) {
        document.getElementById("status").innerHTML = "User successfully deleted as admin.";
        //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
        window.setTimeout(() => { location.reload(); }, 1000);
      } else {
        document.getElementById("status").innerHTML = "Last admin cannot be deleted.";
      }
    });
  }
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

function getUsers() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let userData = JSON.parse(this.responseText);
        if (userData.status == "success") {
          // USER TABLE CREATED HERE
          let userTable = "<table id=\"user-table\"><tr><th>Username</th><th>First Name</th><th>Last Name</th><th>Business Name</th></tr>";
          for (let i = 0; i < userData.rows.length; i++) {
            userTable += (
              "<tr><td class=\"data-index\">" + userData.rows[i].username + "</td><td>" + userData.rows[i].fName + "</td><td>" + userData.rows[i].lName + "</td><td>" + userData.rows[i].cName + "</td></tr>"
            );
          }
          userTable += "</table>";
          document.getElementById("user-list").innerHTML = userTable;
        } else {
          throw "Cannot populate user table.";
        }
      } else {
        throw "Cannot parse data.";
      }
    } else {
      throw "Ready state not done.";
    }
  }
  xhr.open("GET", "/get-all-users");
  xhr.send();
}
getUsers();

document.getElementById("delete-user").addEventListener("click", (e) => {
  e.preventDefault();
  let userInput = { username: document.getElementById("user-username").value };
  document.getElementById("user-username").value = "";
  const xhr = new XMLHttpRequest();
  xhr.onload = (error) => {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        getUsers();
      } else {
        throw error;
      }
    } else {
      throw "Error. Cannot get users."
    }
  }
  xhr.open("POST", "/delete-user");
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send("username=" + userInput.username);
});

function getAdmins() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let adminData = JSON.parse(this.responseText);
        if (adminData.status == "success") {
          // ADMIN TABLE CREATED HERE
          let adminTable = `<table id='admin-table'><tr><th>Username</th></tr>`;
          for (let i = 0; i < adminData.rows.length; i++) {
            adminTable += ("<tr><td class=\"data-index\">" + adminData.rows[i].username + "</td></tr>");
          }
          adminTable += "</table>";
          document.getElementById("admin-list").innerHTML = adminTable;
        } else {
          throw "Cannot populate admin table.";
        }
      } else {
        throw "Cannot parse data.";
      }
    } else {
      throw "Ready state not done.";
    }
  }
  xhr.open("GET", "/get-all-admins");
  xhr.send();
}
getAdmins();

document.getElementById("delete-admin").addEventListener("click", (e) => {
  e.preventDefault();
  let adminInput = { username: document.getElementById("admin-username").value };
  document.getElementById("admin-username").value = "";
  const xhr = new XMLHttpRequest();
  xhr.onload = (error) => {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        getAdmins();
      } else {
        throw error;
      }
    } else {
      throw "Error. Cannot get admins."
    }
  }
  xhr.open("POST", "/delete-admin");
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send("username=" + adminInput.username);
});