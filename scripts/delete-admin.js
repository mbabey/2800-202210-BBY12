'use strict';
const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require('mysql2');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// function getAdmins() {
//     const xhr = new XMLHttpRequest();
//             xhr.onload = function () {
//                 if (this.readyState == XMLHttpRequest.DONE) {

//                     // 200 means everthing worked
//                     if (xhr.status === 200) {

//                       let data = JSON.parse(this.responseText);
//                       if(data.status == "success") {
                          
// }

app.post('/delete-admin', function(req, res) {
    console.log("Username", req.body.username);
    res.setHeader('Content-Type', 'application/json');
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'COMP2800'
    });
    con.connect();
    document.getElementsByClassName("delete-input") = req.body.username;
    let username = req.body.username;
    con.query('DELETE FROM BBY_12_admins WHERE BBY_12_users.username = ?', [username], function(err, results) {
        if (err) throw err;
        res.send({ status:"Success", msg: "Admin access removed."});
    });
    con.end();
});


document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    let formData = { username: document.getElementsByClassName("delete-input").value };
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


       










