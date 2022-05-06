'use strict';
docLoaded(() => {
    async function getData() {
        try {
            let response = await fetch('/get-users', {
                method: 'GET'
            });
            if (response.status == 200) {
                let data = await response.text();
                console.log("the data: " + data);
                popThaSpots(JSON.parse(data));
            } else {
                console.log(response.status);
                console.log(response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    }
    getData();

    function popThaSpots(data) {
        document.querySelector('.business-name-block').innerHTML = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
        document.querySelector('.business-owner-fname-block').innerHTML = (data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
        document.querySelector('.business-owner-lname-block').innerHTML = (data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
        document.querySelector('.business-email-block').innerHTML = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
        document.querySelector('.business-phone-block').innerHTML = (data[0].phoneNo != undefined && data[0].phoneNo != null) ? data[0].phoneNo : '';
        document.querySelector('.business-location-block').innerHTML = (data[0].location != undefined && data[0].location != null) ? data[0].location : '';
        document.querySelector('.business-description-block').innerHTML = (data[0].description != undefined && data[0].description != null) ? data[0].description : '';
    }

    document.getElementById("edit-button").addEventListener("click", function (event) {
        let input = document.createElement("input");
        let biz_name = document.getElementById("business-name-block");
        let biz_owner_fName = document.getElementById("business-owner-fname-block");
        let biz_owner_lName = document.getElementById("business-owner-lname-block");
        let biz_email = document.getElementById("business-email-block");
        let biz_phone = document.getElementById("business-email-block");
        let biz_location = document.getElementById("business-location-block");
        let biz_description = document.getElementById("business-description-block");

        biz_name.contentEditable = true;
        input.appendChild(biz_name);
        biz_owner_fName.contentEditable = true;
        input.appendChild(biz_owner_lName);
        biz_owner_lName.contentEditable = true;
        input.appendChild(biz_owner_lName);
        biz_email.contentEditable = true;
        input.appendChild(biz_email);
        biz_phone.contentEditable = true;
        input.appendChild(biz_phone);
        biz_location.contentEditable = true;
        input.appendChild(biz_location);
        biz_description.contentEditable = true;
        input.appendChild(biz_description);
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

function editCell(e){
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
}