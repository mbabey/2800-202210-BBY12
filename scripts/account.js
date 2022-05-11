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



    document.getElementById("edit-button").addEventListener("click", function (event) {

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

    document.getElementById("save-button").addEventListener("click", function (event) {
        biz_name.contentEditable = false;
        biz_name.style.color = '#000000';
        let biz_name_value = biz_name.innerHTML;

        biz_owner_fName.contentEditable = false;
        biz_owner_fName.style.color = '#000000';
        let biz_owner_fName_value = biz_owner_fName.innerHTML;

        biz_owner_lName.contentEditable = false;
        biz_owner_lName.style.color = '#000000';
        let biz_owner_lName_value = biz_owner_lName.innerHTML;

        biz_type.contentEditable = false;
        biz_type.style.color = '#000000';
        let biz_type_value = biz_type.innerHTML;

        biz_email.contentEditable = false;
        biz_email.style.color = '#000000';
        let biz_email_value = biz_email.innerHTML;

        biz_phone.contentEditable = false;
        biz_phone.style.color = '#000000';
        let biz_phone_value = biz_phone.innerHTML;

        biz_location.contentEditable = false;
        biz_location.style.color = '#000000';
        let biz_location_value = biz_location.innerHTML;

        biz_description.contentEditable = false;
        biz_description.style.color = '#000000';
        let biz_description_value = biz_description.innerHTML;

        document.getElementById("edit-status").innerHTML = "";
        edit_button.innerHTML = "Edit Profile";
        save_button.innerHTML = "";

        let dataToSend = {
            fName: biz_owner_fName_value, lName: biz_owner_lName_value,
            cName: biz_name_value, bType: biz_type_value, email: biz_email_value,
            phoneNo: biz_phone_value, location: biz_location_value,
            description: biz_description_value
        };

        // now send
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE) {

                // 200 means everthing worked
                if (xhr.status === 200) {
                  document.getElementById("edit-status").innerHTML = "Record updated.";

                } else {

                  // not a 200, could be anything (404, 500, etc.)
                  console.log(this.status);

                }

            } else {
                console.log("ERROR", this.status);
            }
        }
        xhr.open("POST", "/update-users");
        console.log("dataToSend", "biz name="+ dataToSend.cName + "&fName=" + dataToSend.fName + "&lName=" + dataToSend.cName + "&biz type=" + dataToSend.bType + "&email=" + dataToSend.email + "&phone=" + dataToSend.phoneNo + "&location=" + dataToSend.location + "&description=" + dataToSend.description);//works
            
        xhr.send(dataToSend);

    
    });

});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

// function editCell(e) {
//     let spanText = e.target.innerHTML;
//     let parent = e.target.parentNode;
//     let input = document.createElement("input");
// }