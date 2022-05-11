'use strict';
docLoaded(() => {
    async function getData() {
        try {
            let response = await fetch('/get-users', {
                method: 'GET'
            });
            if (response.status == 200) {
                let data = await response.text();
                popNavName(JSON.parse(data));
            }
        } catch (err) {
        }
    }
    getData();

    function popNavName(data) {
        document.querySelector('#profile-name').innerHTML = (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
    }
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}