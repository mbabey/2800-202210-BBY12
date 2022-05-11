'use strict';
docLoaded(() => {
    async function getAdminData() {
        try {
            let response = await fetch('/get-admins', {
                method: 'GET'
            });
            if (response.status == 200) {
                let data = await response.text();
                popAdminData(JSON.parse(data));
            }
        } catch (err) {
            document.getElementById("error-messsage").innerHTML = "Cannot get admins.";
        }
    }
    getAdminData();

    function popAdminData(data) {
        document.getElementById("delete-admin").addEventListener("click", function (e) {
            if (data.length != 1) {
                document.getElementById("status").innerHTML = "User successfully deleted as admin."; 
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

function getAdmins() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/get-admins");
    xhr.send();
}
getAdmins();

document.getElementById("delete-admin").addEventListener("click", function (e) {
    e.preventDefault();

    let adminInput = { username: document.getElementById("admin-username").value };
        document.getElementById("admin-username").value = "";

    const xhr = new XMLHttpRequest();
    xhr.onload = function (error) {
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
    xhr.open("POST", "/delete-admins");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("username=" + adminInput.username);
});

