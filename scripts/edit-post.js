'use strict';
console.log("aaaa");
docLoaded(() => {
    console.log("aaaa");
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
    function editPost(event) {
        let post = $(event.target).parentNode.parentNode;
        console.log(post.innerHTML);
    }

    async function getData() {
        try {
            console.log("aaaa");
            let response = await fetch('/get-user', {
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
        console.log("aaaa");
        biz_name.innerHTML = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
        biz_owner_fName.innerHTML = (data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
        biz_owner_lName.innerHTML = (data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
        biz_type.innerHTML = (data[0].bType != undefined && data[0].bType != null) ? data[0].bType : '';
        biz_email.innerHTML = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
        biz_phone.innerHTML = (data[0].phoneNo != undefined && data[0].phoneNo != null) ? data[0].phoneNo : '';
        biz_location.innerHTML = (data[0].location != undefined && data[0].location != null) ? data[0].location : '';
        biz_description.innerHTML = (data[0].description != undefined && data[0].description != null) ? data[0].description : '';
    }

    document.getElementById("edit-button").addEventListener("click", (event) => {
        console.log("aaaa");
        biz_name.contentEditable = true;
        biz_name.style.color = '#3632a8';

        biz_owner_fName.contentEditable = true;
        biz_owner_fName.style.color = '#3632a8';

        biz_owner_lName.contentEditable = true;
        biz_owner_lName.style.color = '#3632a8';

        biz_type.contentEditable = true;
        biz_type.style.color = '#3632a8';

        biz_email.contentEditable = true;
        biz_email.style.color = '#3632a8';

        biz_phone.contentEditable = true;
        biz_phone.style.color = '#3632a8';

        biz_location.contentEditable = true;
        biz_location.style.color = '#3632a8';

        biz_description.contentEditable = true;
        biz_description.style.color = '#3632a8';

        document.getElementById("edit-status").innerHTML = "";
        edit_button.innerHTML = "";
        save_button.innerHTML = "Save";
        event.preventDefault();
    });

    function saved(data) {
        console.log("aaaa");
        data.contentEditable = false;
        data.style.color = '#000000';
    };

    function checkEmpty(data) {
        console.log("aaaa");
        let checkEmpty = data.trim();
        let checkSpace = data.replace('/&nbsp;/g', '');
        let checkEnter = data.replace('/<div><br></div>/g', '');

        if (checkEmpty == '' || checkSpace.trim() == '' || checkEnter.trim() == '') {
            return false;
        } else {
            return true;
        }
    };

    document.getElementById("save-button").addEventListener("click", (event) => {
        console.log("aaaa");
        saved(biz_name);
        let biz_name_value = biz_name.innerHTML;
        if (!checkEmpty(biz_name_value)) {
            biz_name_value = biz_name_value = "Enter business name here";
        };

        saved(biz_owner_fName);
        let biz_owner_fName_value = biz_owner_fName.innerHTML;
        if (!checkEmpty(biz_owner_fName_value)) {
            biz_owner_fName_value = "first name";
        };

        saved(biz_owner_lName);
        let biz_owner_lName_value = biz_owner_lName.innerHTML;
        if (!checkEmpty(biz_owner_lName_value)) {
            biz_owner_lName_value = "last name";
        };

        saved(biz_type);
        let biz_type_value = biz_type.innerHTML;
        if (!checkEmpty(biz_type_value)) {
            biz_type_value = "Enter business type";
        };

        saved(biz_email);
        let biz_email_value = biz_email.innerHTML;
        if (!checkEmpty(biz_email_value)) {
            biz_email_value = "Enter email";
        };

        saved(biz_owner_fName);
        let biz_phone_value = biz_phone.innerHTML;
        if (!checkEmpty(biz_phone_value)) {
            biz_phone_value = "Enter phone number";
        };

        saved(biz_location);
        let biz_location_value = biz_location.innerHTML;
        if (!checkEmpty(biz_location_value)) {
            biz_location_value = "Enter location";
        };

        saved(biz_description);
        let biz_description_value = biz_description.innerHTML;
        if (!checkEmpty(biz_description_value)) {
            biz_description_value = "Enter description";
        };

        document.getElementById("edit-status").innerHTML = "";
        edit_button.innerHTML = "Edit Profile";
        save_button.innerHTML = "";

        let dataToSend = {
            fName: biz_owner_fName_value,
            lName: biz_owner_lName_value,
            cName: biz_name_value,
            bType: biz_type_value,
            email: biz_email_value,
            phoneNo: biz_phone_value,
            location: biz_location_value,
            description: biz_description_value
        };

        console.log(dataToSend);
        sendData(JSON.stringify(dataToSend));
        location.reload();

    });
});

async function sendData(data) {
    try {
        console.log("aaaa");
        await fetch('/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        });
    } catch (err) {
        console.log(err);
    }
}

function docLoaded(action) {
    console.log("aaaa");
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

