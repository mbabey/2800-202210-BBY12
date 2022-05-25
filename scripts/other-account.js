'use strict';
docLoaded(() => {
    const bizInfo = {
        cName: document.querySelectorAll('.business-name-block'),
        fName: document.querySelectorAll('.business-owner-fname-block'),
        lName: document.querySelectorAll('.business-owner-lname-block'),
        bType: document.querySelectorAll('.business-type-block'),
        email: document.querySelectorAll('.business-email-block'),
        phoneNo: document.querySelectorAll('.business-phone-block'),
        location: document.querySelectorAll('.business-location-block'),
        description: document.querySelectorAll('.business-description-block')
    };

    async function sendName() {
        try {
            let response = await fetch('/get-other-user?' + new URLSearchParams(window.location.search), {
                method: 'GET',
            });
            if (response.status == 200) {
                response = await response.text();
                response = JSON.parse(response);
                popThaSpots(response);
            }
        } catch (err) {
            console.log(err);
        }
    }
    sendName();

    function popThaSpots(data) {
        document.querySelector("#profile-picture").src = "./avatars/" + data[0].profilePic;
        for (const [key, value] of Object.entries(bizInfo)) {
            value.forEach((element) => {
                element.innerHTML = (data[0][key] != undefined && data[0][key] != null) ? data[0][key] : '';
            });
        }
    }
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}




