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
                // populate tha spots bruh
            } else {
                console.log(response.status);
                console.log(response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    }
    getData();

    // document.querySelector('.edit-profile').addEventListener("click", editProfile);
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}