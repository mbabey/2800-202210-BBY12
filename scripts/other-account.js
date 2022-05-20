'use strict';
docLoaded(() => {
    let biz_name = document.querySelector('.business-name-block');
    let biz_owner_fName = document.querySelector('.business-owner-fname-block');
    let biz_owner_lName = document.querySelector('.business-owner-lname-block');
    let biz_type = document.querySelector('.business-type-block');
    let biz_email = document.querySelector('.business-email-block');
    let biz_phone = document.querySelector('.business-phone-block');
    let biz_location = document.querySelector('.business-location-block');
    let biz_description = document.querySelector('.business-description-block');

    async function sendName() {
        try {
            let response = await fetch('/get-other-user?' + new URLSearchParams(window.location.search), {
                method: 'GET',
            });
            if (response.status == 200) {
                let data = await response.text();
                let dataParsed = JSON.parse(data);
                console.log(dataParsed);
                popThaSpots(dataParsed);
            }
        } catch (err) {
            console.log(err);
        }
    }
    sendName();

    function popThaSpots(data) {
        document.querySelector("#profile-picture").src = "./avatars/" + data[0].profilePic;
        biz_name.innerHTML = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
        biz_owner_fName.innerHTML = (data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
        biz_owner_lName.innerHTML = (data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
        biz_type.innerHTML = (data[0].bType != undefined && data[0].bType != null) ? data[0].bType : '';
        biz_email.innerHTML = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
        biz_phone.innerHTML = (data[0].phoneNo != undefined && data[0].phoneNo != null) ? data[0].phoneNo : '';
        biz_location.innerHTML = (data[0].location != undefined && data[0].location != null) ? data[0].location : '';
        biz_description.innerHTML = (data[0].description != undefined && data[0].description != null) ? data[0].description : '';
    }

});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}