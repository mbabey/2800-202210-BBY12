const express = require('express');
const session = require('express-session');
//const http = require('http');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');

const port = 8000;
app.listen(port, () => {
    console.log('Gro-Operate running on port: ' + port);
});

app.get('/', (req, res) => {
    res.send("Hello wordl");

    // if session, login
    
    // else, redirect to login.html
    
});


app.get('/login', () => {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'store'
    });

    con.connect(function(err) {
            if(err) throw err;
            console.log("Poggers");
            con.query("SELECT * FROM `user`", function (err, result, fields){
                    if(err) throw err;
                    console.log(result);
            });
    });
});
