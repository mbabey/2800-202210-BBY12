'use strict';
docLoaded(() => {
  async function getUserData() {
    try {
      let response = await fetch('/get-all-users', {
        method: 'GET'
      });
      if (response.status == 200) {
        let data = await response.text();
        popUserData(JSON.parse(data));
      }
    } catch (err) {
      throw "Cannot get users.";
    }
  }
  getUserData();

  function popUserData(data) {
    document.getElementById("delete-user").addEventListener("click", (e) => {
      if (data.length != 1) {
        document.getElementById("status-2").innerHTML = "User successfully deleted.";
        //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
        window.setTimeout(() => { location.reload(); }, 1000);
      } else {
        document.getElementById("status-2").innerHTML = "User cannot be deleted if only one user is left.";
      }
    });
  }

  async function getAdminData() {
    try {
      let response = await fetch('/get-all-admins', {
        method: 'GET'
      });
      if (response.status == 200) {
        let data = await response.text();
        popAdminData(JSON.parse(data));
      }
    } catch (err) {
      throw "Cannot get admins."
    }
  }
  getAdminData();

  function popAdminData(data) {
    document.getElementById("delete-admin").addEventListener("click", (e) => {
      if (data.length != 1) {
        document.getElementById("status").innerHTML = "User successfully deleted as admin.";
        //this refresh function was referenced from https://www.codegrepper.com/code-examples/javascript/window.location.reload+after+5+seconds
        window.setTimeout(() => { location.reload(); }, 1000);
      } else {
        document.getElementById("status").innerHTML = "Admin cannot be deleted if only one admin is left.";
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
        let data = JSON.parse(this.responseText);
        if (data.status == "success") {
          // USER TABLE CREATED HERE
          let table = "<table id=\"user-table\"><tr><th>Username</th><th>First Name</th><th>Last Name</th><th>Business Name</th></tr>";
          for (let i = 0; i < data.rows.length; i++) {
            table += (
              "<tr><td class=\"data-index\">" + data.rows[i].username + "</td><td>" + data.rows[i].fName + "</td><td>" + data.rows[i].lName + "</td><td>" + data.rows[i].cName + "</td></tr>"
            );
          }
          table += "</table>";
          document.getElementById("user-list").innerHTML = table;
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
        let data = JSON.parse(this.responseText);
        if (data.status == "success") {
          // ADMIN TABLE CREATED HERE
          let table = `<table id='admin-table'><tr><th>Username</th></tr>`;
          for (let i = 0; i < data.rows.length; i++) {
            table += ("<tr><td class=\"data-index\">" + data.rows[i].username + "</td></tr>");
          }
          table += "</table>";
          document.getElementById("admin-list").innerHTML = table;
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