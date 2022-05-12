'use strict';
docLoaded(() => {
    function getAdmins() {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let data = JSON.parse(this.responseText);
                    if (data.status == "success") {
                        let username = "<h3>" + data.rows[0].username + "</h3>";
                        let first_name = "<p>" + data.rows[0].fName + "</p>";
                        let last_name = "<p>" + data.rows[0].lName + "</p>";
                        let business_name = "<p>" + data.rows[0].cName + "</p>";
                        
                        document.getElementById("u-name").innerHTML = username;
                        document.getElementById("f-name").innerHTML = first_name;
                        document.getElementById("l-name").innerHTML = last_name;
                        document.getElementById("b-name").innerHTML = business_name;
                    } else {
                        throw "Cannot populate admin table.";
                    }
                } else {
                    throw "Cannot parse data.";
                }
            } else {
                throw "Ready state not done.";
            }
        }
        xhr.open("GET", "/get-admin");
        xhr.send();
    }
    getAdmins();
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

