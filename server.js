const express = require('express');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');

const port = 8000;
app.listen(port, () => {
        console.log('Gro-Operate running on port: ' + port);
});

app.get('/', () => {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'store'
    });

    con.connect(function(err) {
            if(err) throw err;
            console.log("Poggers");
            con.query(mysql, function (err, result){
                    if(err) throw err;
                    console.log('Result: ' + result);
            });
    });
    
});

