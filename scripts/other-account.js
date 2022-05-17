//user link to the cName (use username for now) in the url
//pass that cName parameter into /somewhere
//somewhere goes into the db to retrieve that data


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

    let edit_button = document.getElementById("edit-button");
    let save_button = document.getElementById("save-button");

    sendCName({ cName: biz_name.innerHTML });

    async function sendCName(data) {
        try {
            let response = await fetch('/post-other', {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(data)
            });
            if (response.status == 200) {
                let data = await response.text();
                let dataParsed = JSON.parse(data);
                popThaSpots(dataParsed.rows);
            }
        } catch (err) {
            console.log(err);
        }
    }


    function popThaSpots(data) {
        biz_name.innerHTML = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
        biz_owner_fName.innerHTML = (data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
        biz_owner_lName.innerHTML = (data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
        biz_type.innerHTML = (data[0].bType != undefined && data[0].bType != null) ? data[0].bType : '';
        biz_email.innerHTML = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
        biz_phone.innerHTML = (data[0].phoneNo != undefined && data[0].phoneNo != null) ? data[0].phoneNo : '';
        biz_location.innerHTML = (data[0].location != undefined && data[0].location != null) ? data[0].location : '';
        biz_description.innerHTML = (data[0].description != undefined && data[0].description != null) ? data[0].description : '';
    }



    function docLoaded(action) {
        if (document.readyState != 'loading')
            action();
        else
            document.addEventListener('DOMContentLoaded', action);
    }
})