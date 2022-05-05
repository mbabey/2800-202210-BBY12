'use strict';

//populate the 'account-info' div dynamically
function getUser() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

                //what's this.reponseText referring to?  
                let data = JSON.parse(this.responseText);
                if (data.status == "success") {

                    let str = `        <h3>My Account</h3>`;


                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows[i];
                        //console.log("row", row);
                        str += ("<div class='first_name'><span>" + row.fName
                            + "</span></div>" + "<div class='last_name'><span>" + row.lName
                            + "</span></div>" + "<div class='email'><span>" + row.email
                            + "</span></div>" + "<div class='password'><span>"
                            + row.password + "</span></div>");
                    }
                    console.log(str);
                    document.getElementsByClassName("account-info").innerHTML = str;

                    // select all spans under the email class of div elements
                    let first_name_records = document.querySelectorAll("div[class='first_name'] span");
                    for (let j = 0; j < first_name_records.length; j++) {
                        first_name_records[j].addEventListener("click", editCell);
                    }

                    let last_name_records = document.querySelectorAll("div[class='last_name'] span");
                    for (let j = 0; j < last_name_records.length; j++) {
                        last_name_records[j].addEventListener("click", editCell);
                    }

                    let email_records = document.querySelectorAll("div[class='email'] span");
                    for (let j = 0; j < email_records.length; j++) {
                        email_records[j].addEventListener("click", editCell);
                    }

                    let pswd_records = document.querySelectorAll("div[class='password'] span");
                    for (let j = 0; j < pswd_records.length; j++) {
                        pswd_records[j].addEventListener("click", editCell);
                    }

                } else {
                    console.log("Error!");
                }

            } else {

                // not a 200, could be anything (404, 500, etc.)
                console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("GET", "/get-users");//stuck on producing a /get-users
    xhr.send();
}
getUser();

//to edit the cells, e for event
function editCell(e) {

    // add a listener for clicking on the field to change info
    // span's text
    let spanText = e.target.innerHTML;
    // span's parent (div)
    let parent = e.target.parentNode;
    // create a new input, and add a key listener to it
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let s = null;
        let v = null;
        // pressed enter
        if (e.key == 13) { //changed e.which to e.key because e.which is deprecated, 13 is the enter key
            v = input.value;
            let newSpan = document.createElement("span"); //create a new element span
            // have to wire an event listener to the new element
            newSpan.addEventListener("click", editCell);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            
            //if newSpan is within the first name div OR the last name div OR the email div OR the password div
            //do different dataToSend


            if (document.getElementsByClassName("first_name")){
                let dataToSend = {
                    last_name: parent.parentNode.querySelector(".last_name").innerHTML,
                    email: parent.parentNode.querySelector(".email").innerHTML,
                    password: parent.parentNode.querySelector(".password").innerHTML,
                    first_name: v
                }

            } else if (document.getElementsByClassName("last_name")){
                let dataToSend = {
                    first_name: parent.parentNode.querySelector(".first_name").innerHTML,
                    email: parent.parentNode.querySelector(".email").innerHTML,
                    password: parent.parentNode.querySelector(".password").innerHTML,
                    last_name: v
                }

            } else if (document.getElementsByClassName("email")){
                let dataToSend = {
                    first_name: parent.parentNode.querySelector(".first_name").innerHTML,
                    last_name: parent.parentNode.querySelector(".last_name").innerHTML,
                    password: parent.parentNode.querySelector(".password").innerHTML,
                    email: v
                }

            } else if (document.getElementsByClassName("password")){
                let dataToSend = {
                    first_name: parent.parentNode.querySelector(".first_name").innerHTML,
                    last_name: parent.parentNode.querySelector(".last_name").innerHTML,
                    email: parent.parentNode.querySelector(".email").innerHTML,
                    password: v
                }

            } else {

            }

            // now send
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {

                    // 200 means everthing worked
                    if (xhr.status === 200) {
                        document.getElementsByClassName("status").innerHTML = "Record updated.";
                        getCustomers();


                    } else {

                        // not a 200, could be anything (404, 500, etc.)
                        console.log(this.status);

                    }

                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-user");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //console.log("dataToSend", "id=" + dataToSend.id + "&email=" + dataToSend.email);
            //sending to the server side, so need to update that to set fName=?,....  send everything
            //cannot check /update-user for now because can't login properly
            xhr.send("fName=" + dataToSend.fName + "&lName=" + dataToSend.lName + "&email=" + dataToSend.email + "&password=" + dataToSend.password); 

        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}