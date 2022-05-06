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
        document.querySelector('.business-name-block').innerHTML = data[0].cName;
        // document.querySelector('.business-type-block').innerHTML(data.);
        document.querySelector('.business-owner-fname-block').innerHTML = data[0].fName;
        document.querySelector('.business-owner-lname-block').innerHTML = data[0].lName;
        document.querySelector('.business-email-block').innerHTML = data[0].email;
        document.querySelector('.business-phone-block').innerHTML = data[0].phoneNo;
        document.querySelector('.business-location-block').innerHTML = data[0].location;
        document.querySelector('.business-description-block').innerHTML = data[0].description;
    }

    // document.querySelector('.edit-profile').addEventListener("click", editProfile);
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}