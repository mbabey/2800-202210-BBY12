'use strict';

console.log("Client script loaded.");

function getUser() {
    function ajaxGet(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);
            }
        }

        xhr.open("GET", url);
        xhr.send();
    }

    ajaxGet("/get-users", function(data) {
        let userInfo = JSON.parse(data);

        document.getElementById("profile-owner-name").innerHTML = userInfo.rows[0].cName;
        document.getElementById("profile-contact-email").innerHTML = userInfo.rows[0].email;
        document.getElementById("profile-contact-phone").innerHTML = userInfo.rows[0].phoneNo;
        document.getElementById("profile-location-address").innerHTML = userInfo.rows[0].location;

        document.getElementById("edit-button").addEventListener("click", function(event) {
            document.getElementById("profile-owner-name").contentEditable = true;
            document.getElementById("profile-contact-email").contentEditable = true;
            document.getElementById("profile-contact-phone").contentEditable = true;
            document.getElementById("profile-location-address").contentEditable = true;
            document.getElementById("edit-status").innerHTML = "Click on the fields to edit."
            event.preventDefault();
        });


    })
}

getUser();