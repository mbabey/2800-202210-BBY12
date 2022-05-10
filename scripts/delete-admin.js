'use strict';

const express = require('express');
const app = express();
const fs = require("fs");
const mysql = require('mysql2');

// module.exports = {

//     deleteAdmin: async function(req, res) {
//         res.setHeader('Content-Type', 'application/json');
//         let connection = mysql.createConnection({
//             host: 'localhost',
//             user: 'root',
//             password: '',
//             database: 'COMP2800'
//         });
//         connection.connect();
//         let success = checkDB(req, connection);
//         await success
//             .then(function(result) {
//                 deleteAdmin(req.body.username, connection)
//                     .then()
//                     .catch(function(err) {});
//             }).catch(function(err) {});
//         connection.end();
//         return success;
//     }
// };

// function checkDB(req, connection) {
//     return new Promise((resolve, reject) => {
//         document.getElementsByClassName("delete-input") = req.body.username;
//         let username = req.body.username;
//         if (checkUsername(username, req)) {
            
//             connection.query('SELECT * FROM BBY_12_admins WHERE BBY_12_users.username = ?', [username],
//                 function(err) {
//                     console.log("Number of records deleted: " + result.affectedRows);
//                     if (err) {
//                         reject(new Error("The user is not an admin."));
//                     } else {
//                         resolve(true);
//                     }
//                 });
//         } else {
//             reject(new Error("That username doesn't exist!"));
//         };
//     });
// };

// function deleteAdmin(username, connection) {
//     return new Promise((resolve, reject) => {
//         connection.query('DELETE FROM BBY_12_admins WHERE BBY_12_admins.username = ?', [username],
//             function(err) {
//                 if (err) {
//                     reject(new Error("Delete admin failed"));
//                 } else {
//                     resolve(true);
//                 }
//             });
//     });
// }

// function checkUsername(username, req) {
//     if (username != req.session.username) {
//         return (username);
//     }
// }

function getAdmins() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

              let data = JSON.parse(this.responseText);
              if(data.status == "success") {

                    let table = "<table><tr><th>Username</th></tr>";
                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows[i];
                        table += "<tr><td>" + row.username + "</td></tr>";
                    }
                    table += "</table>";

                    //console.log(str);
                    adminViewAccDOM.window.document.getElementById("admin-list").innerHTML = table;

                

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
    xhr.open("GET", "/get-admins");
    xhr.send();
}
getAdmins();




document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();
    let formData = {
        username: document.getElementsByClassName("delete-input").value
    };
    document.getElementsByClassName("delete-input").value = "";
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

                getAdmins();
                document.getElementById("status").innerHTML = "Admin access revoked.";

            } else {

                // not a 200, could be anything (404, 500, etc.)
                console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/delete-admin");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("Username = " + formData.username);

});