'use strict';

function getUserList(url, callback) {
  const userList = document.createElement('table');
  userList.src = url;
  userList.onload = callback;
  document.body.appendChild(userList);
}

var usersTable = null;

document.getElementById("user-list").addEventListener("click", function(e) {
  e.preventDefault();
  getScript('/dynamically-loaded-script', function() {
      console.log("Script loaded.");
      something = greeting;
  });
});


document.getElementById("runDynamicScript").addEventListener("click", function(e) {
  e.preventDefault();
  something();

});

function ready(callback) {
  if (document.readyState != "loading") {
    callback();
    console.log("Ready state is 'complete'");
  } else {
    document.addEventListener("DOMContentLoaded", callback);
    console.log("Event listener invoked");
  }
}

ready(function () {
  console.log("Client.js has loaded");

  function ajaxGet(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText);
      } else {
        console.log(this.status);
      }
    }
    xhr.open("GET", url);
    xhr.send();
  }

  ajaxGet("/admin-view-accounts", function (data) {
      console.log("Received data:" + data);
      const userData = JSON.parse(data);
      console.log("Parsed data:" + userData);

      let table = document.createElement("table");
      let user = userData[0].username;
      let keys = Object.keys(user);

      let tableHeader = document.createElement("tr");
      for (i = 0; i < keys.length; i++) {
      let header = document.createElement("th");
      header.innerHTML = keys[i];
      tableHeader.appendChild(header);
      }
      table.appendChild(tableHeader);

      for (i = 0; i < userData.length; i++) {
      let user = userData[i];
      let tableRow = document.createElement("tr");
      let size = document.createElement("td");
      size.innerHTML = user.size;
      tableRow.appendChild(size);
      table.appendChild(tableRow);
      }
      document.body.replaceChild(table, document.getElementById("user-list"));
  });
});