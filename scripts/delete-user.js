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
        document.getElementById("delete-user").addEventListener("click", function (e) {
            if (data.length != 1) {
                document.getElementById("status-2").innerHTML = "User successfully deleted."; 
            } else {
                document.getElementById("status-2").innerHTML = "User cannot be deleted if only one user is left.";
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
                    let table = "<table><tr><th>Username</th><th class=\"admin-user-info\">First Name</th><th class=\"admin-user-info\">Last Name</th><th class=\"admin-user-info\">Business Name</th></tr>";
                    for (let i = 0; i < data.rows.length; i++) {
                        table += ("<tr><td>" + data.rows[i].username + "</td><td class=\"admin-user-info\">" 
                        + data.rows[i].fName + "</td><td class=\"admin-user-info\">"
                        + data.rows[i].lName + "</td><td class=\"admin-user-info\">"
                        + data.rows[i].cName + "</td></tr>");
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
    xhr.open("GET", "/get-user-table");
    xhr.send();
}
getUsers();

document.getElementById("delete-user").addEventListener("click", function (e) {
    e.preventDefault();

    let userInput = { username: document.getElementById("user-username").value };
        document.getElementById("user-username").value = "";


    const xhr = new XMLHttpRequest();
    xhr.onload = function (error) {
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
    xhr.open("POST", "/delete-users");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("username=" + userInput.username);
});

