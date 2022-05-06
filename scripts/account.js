'use strict';
docLoaded(() => {
    async function getData() {
        try {
            let response = await fetch('/get-users', {
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
        document.querySelector('.business-name-block').innerHTML = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
        document.querySelector('.business-owner-fname-block').innerHTML = (data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
        document.querySelector('.business-owner-lname-block').innerHTML = (data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
        document.querySelector('.business-type-block').innerHTML = (data[0].bType != undefined && data[0].bType != null) ? data[0].bType : '';
        document.querySelector('.business-email-block').innerHTML = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
        document.querySelector('.business-phone-block').innerHTML = (data[0].phoneNo != undefined && data[0].phoneNo != null) ? data[0].phoneNo : '';
        document.querySelector('.business-location-block').innerHTML = (data[0].location != undefined && data[0].location != null) ? data[0].location : '';
        document.querySelector('.business-description-block').innerHTML = (data[0].description != undefined && data[0].description != null) ? data[0].description : '';
    }

    document.getElementById("edit-button").addEventListener("click", function(event) {
        document.getElementsByClassName("business-name-block").contentEditable = true;
        document.getElementsByClassName("business-owner-fname-block").contentEditable = true;
        document.getElementsByClassName("business-owner-lname-block").contentEditable = true;
        document.getElementsByClassName("business-email-block").contentEditable = true;
        document.getElementsByClassName("business-phone-block").contentEditable = true;
        document.getElementsByClassName("business-location-block").contentEditable = true;
        document.getElementsByClassName("business-description-block").contentEditable = true;
        document.getElementById("edit-status").innerHTML = "Click on the fields to edit.";
        event.preventDefault();
    });
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}