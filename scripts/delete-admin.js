'use strict';
const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require('mysql2');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/delete-admin', function(req, res) {
    console.log(req.body.username);
    res.setHeader('Content-Type', 'application/json');
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'COMP2800'
    });
    con.connect();
    con.query('DELETE FROM BBY_12_admins WHERE BBY_12_users.username = ?', [req.body.username], function(err, results) {
        if (err) throw err;
        res.send({ status:"Success", msg: "Admin access removed."});
    });
    con.end();
});

function deleteAdmin(e) {
    document.getElementById("submit").addEventListener("click", function(e) {
        e.preventDefault();
        let formData = { username: document.getElementById("username").value };
        document.getElementById("username").value = "";
    });
       
}









