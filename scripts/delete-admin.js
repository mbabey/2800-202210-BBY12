'use strict';

function getAdmins() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/get-admins");
    xhr.send();
}
getAdmins();

document.getElementById("delete-admin").addEventListener("click", function (e) {
    e.preventDefault();

    let formData = { username: document.getElementById("username").value };
        document.getElementById("username").value = "";

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {
                document.getElementById("status").innerHTML = "User deleted as admin.";
                getAdmins();
     
                console.log(formData.username);
                
            } else {
                document.getElementById("error-message").innerHTML = "Cannot delete user as admin.";
                // not a 200, could be anything (404, 500, etc.)
                console.log(this.status);
      

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/delete-admins");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("username=" + formData.username);
});

