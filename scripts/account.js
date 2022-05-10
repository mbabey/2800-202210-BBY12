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

    let biz_name = document.querySelector('.business-name-block');
    let biz_owner_fName = document.querySelector('.business-owner-fname-block');
    let biz_owner_lName = document.querySelector('.business-owner-lname-block');
    let biz_type = document.querySelector('.business-type-block');
    let biz_email = document.querySelector('.business-email-block');
    let biz_phone = document.querySelector('.business-phone-block');
    let biz_location = document.querySelector('.business-location-block');
    let biz_description = document.querySelector('.business-description-block');
    let edit_button = document.getElementById("edit-button");
    let save_button = document.getElementById("save-button");

    document.getElementById("edit-button").addEventListener("click", function (event) {

        // document.getElementsByClassName('business-name-block').contentEditable=true;
        // document.querySelector('.business-name-block').contentEditable=true;
        // document.getElementsByClassName("profile-header").style.backgroundColor = "#dddbdb";

        // let input = document.createElement("input");


        biz_name.contentEditable = true;
        biz_name.style.color = '#3632a8';
        // input.appendChild(biz_name);
        biz_owner_fName.contentEditable = true;
        biz_owner_fName.style.color = '#3632a8';
        // input.appendChild(biz_owner_lName);
        biz_owner_lName.contentEditable = true;
        biz_owner_lName.style.color = '#3632a8';
        // input.appendChild(biz_owner_lName);
        biz_type.contentEditable = true;
        biz_type.style.color = '#3632a8';
        // input.appendChild(biz_type);
        biz_email.contentEditable = true;
        biz_email.style.color = '#3632a8';
        // input.appendChild(biz_email);
        biz_phone.contentEditable = true;
        biz_phone.style.color = '#3632a8';
        // input.appendChild(biz_phone);
        biz_location.contentEditable = true;
        biz_location.style.color = '#3632a8';
        // input.appendChild(biz_location);
        biz_description.contentEditable = true;
        biz_description.style.color = '#3632a8';
        // input.appendChild(biz_description);
        document.getElementById("edit-status").innerHTML = "Click on the fields to edit.";
        edit_button.innerHTML = "";
        save_button.innerHTML = "Save";
        event.preventDefault();


    });

    document.getElementById("save-button").addEventListener("click", function (event) {
        biz_name.contentEditable = false;
        biz_name.style.color = '#000000';
        // input.appendChild(biz_name);
        biz_owner_fName.contentEditable = false;
        biz_owner_fName.style.color = '#000000';
        // input.appendChild(biz_owner_lName);
        biz_owner_lName.contentEditable = false;
        biz_owner_lName.style.color = '#000000';
        // input.appendChild(biz_owner_lName);
        biz_type.contentEditable = false;
        biz_type.style.color = '#000000';
        // input.appendChild(biz_type);
        biz_email.contentEditable = false;
        biz_email.style.color = '#000000';
        // input.appendChild(biz_email);
        biz_phone.contentEditable = false;
        biz_phone.style.color = '#000000';
        // input.appendChild(biz_phone);
        biz_location.contentEditable = false;
        biz_location.style.color = '#000000';
        // input.appendChild(biz_location);
        biz_description.contentEditable = false;
        biz_description.style.color = '#000000';
        document.getElementById("edit-status").innerHTML = "";
        edit_button.innerHTML="Edit Profile";
        save_button.innerHTML="";
    })

});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

function editCell(e) {
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
}