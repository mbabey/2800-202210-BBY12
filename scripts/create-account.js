const mysql = require('mysql2');
const crypto = require('crypto');

module.exports = {
    createAccount: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'comp2800'
        });
        connection.connect();
        let username = req.body.username;
        let pass = req.body.password;
        let success = false;
        if (checkUsername(username, req) && checkPassword(pass, req)) {
            console.log(req.body);
            let location = req.body["location-street"] + ", " + req.body["location-city"] + ", " + req.body["location-country"];
            console.log(location);
            //console.log([username, pass, req.body["first-name"], req.body["last-name"], req.body["company-name"], req.body["email"], req.body["phone-num"], location, req.body["description"]]);
            success = true;
        } else console.log("not same");
        // const hash = crypto.createHash('sha256').update(pass).digest('hex');
        // connection.query('INSERT INTO bby12users (username, password, fName, lName, email, phoneNo, location, description) values (?, ?,?,?,?,?,?,?)', 
        // [username, hash, req.body["first-name"],req.body["last-name"],req.body["company-name"],req.body["email"],req.body["phone-num"],location, req.body["description"]],
        //     function(error, results, fields) {
        //         if (error) {
        //             console.log(error);
        //         }
        //         //console.log('Rows returned are: ', results);
        //         res.send({ status: "success", msg: "Record added." });

        //     });
        connection.end();
        return success;
    }
};

function checkUsername(username, req) {
    return (username && username === req.body["username-verify"]); // TODO: Add additional checks: ie. min length
}

function checkPassword(pass, req) {
    return (pass && pass === req.body["password-verify"]); // TODO: Add additional checks: ie. min length
}