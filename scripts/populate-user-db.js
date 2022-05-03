async function init() {
    //promise that allows us to execute code in a synchronous manner
    const mysql = require("mysql2/promise");
    //finish excute this before going to the next line
    //kind of not sure what this is
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });
    //creating the database and table
    const createDBAndTable = `CREATE DATABASE IF NOT EXISTS grooperate;
        use grooperate;
        CREATE TABLE IF NOT EXISTS users (
        ID int NOT NULL AUTO_INCREMENT,
        username varchar(50),
        first_name varchar(50),
        last_name varchar(50),
        email_address varchar(50),
        password varchar(50),
        PRIMARY KEY (ID));`; //make ID the primary key
    await connection.query(createDBAndTable); //wait for this line to finish executing before the next line
    const [rows, fields] = await connection.query("SELECT * FROM users"); //wait to finish b4 proceeding

    //if there are no rows in the database table, which means no record
    if (rows.length == 0) {
        let userRecords = "insert into users (username, first_name, last_name, email_address, password) values ?";
        let recordValues = [
            ["oliviaborwn", "Olivia", "Brown", "oliviabrown@123.com", "demodemo"],
            ["btyyn", "Betty", "Nguyen", "bnguyen@bcit.ca", "demodemo"],
            ["carolinelin", "Caroline", "Lin", "carolinelin@123.com", "demodemo"],
            ["meimei", "Mei", "Lee", "4town4ever@gmail.com", "demodemo"]
        ];
        await connection.query(userRecords, [recordValues]);//call userRecords, insert recordValues
    }

    const createDBAndTable2 = `use users;
    CREATE TABLE IF NOT EXISTS user_timeline (
        ID int NOT NULL AUTO_INCREMENT,
        user_ID int NOT NULL,
        date varchar(20),
        text varchar(500),
        time varchar(10),
        view varchar(10),
        PRIMARY KEY (ID),
        FOREIGN KEY (user_ID) REFERENCES A01206267_user(ID) ON UPDATE CASCADE ON DELETE CASCADE);`; //make timeID primary key, ID foreign key (need to connect to the first table, idk how for now) 
    //SELECT user.ID
    await connection.query(createDBAndTable2); //wait for this line to finish executing before the next line
    const [rows2, fields2] = await connection.query("SELECT * FROM users_timeline"); //wait to finish b4 proceeding

    //if there are no rows in the database table, which means no record
    if (rows2.length == 0) {
        let userRecords = "insert into  (ID, date, text, time, view) values ?"; // kind of unsure about this line
        let recordValues = [
        ];
        await connection.query(userRecords, [recordValues]);//call userRecords, insert recordValues
    }


    connection.end();
    console.log("Server is now running on port 8000.");

}