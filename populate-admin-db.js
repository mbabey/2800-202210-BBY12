//importing libaries 
const express = require("express");
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');

//initialize express app
const app = express();

//function to create database by running this file in node
async function init() {
    //promise that allows code to execute in a synchronous manner
    const mysql = require("mysql2/promise");
  
    const connection = await mysql.createConnection({
        //change to 127.0.0.1 for macOS & localhost for windows
        host: "127.0.0.1",
        user: "root",
        //change password if necessary
        password: " ",
        multipleStatements: true
    });
  
    //create the database if not exist and create table for users
    const createDBAndUserTable = `CREATE DATABASE IF NOT EXISTS BBY12;
        use BBY12;
        CREATE TABLE IF NOT EXISTS BBY12Users (
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            fName VARCHAR(255),
            lName VARCHAR(255),
            cName VARCHAR(255),
            email VARCHAR(255),
            phoneNo VARCHAR(255),
            location VARCHAR(255),
            description LONGTEXT,
            profilePic VARCHAR(255),
            PRIMARY KEY (username));`;
    await connection.query(createDBAndUserTable);
  
    const createDBAndTables2 = `CREATE DATABASE IF NOT EXISTS BBY12;
      use BBY12;
      CREATE TABLE IF NOT EXISTS BBY12Admins (
        username VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY (username),
        FOREIGN KEY (username)
            REFERENCES BBY12Users (username));`;
    await connection.query(createDBAndTables2);
  
    const [rows, fields] = await connection.query("SELECT * FROM BBY12Users");
    if (rows.length == 0) {
        let userRecords = "INSERT INTO BBY12users (username, password, fName, lName, cName, email, phoneNo, location, description, profilePic) values ?";
        let recordValues = [
            ['test', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Drop', 'Table',"Gro Operate", '123@321.com', '(123) 456-7890', 'here, now', 'I am the progenitor of all accounts', 'img.jpg']
        ];
    //call userRecords, insert recordValues
    await connection.query(userRecords, [recordValues]);
 
    const [rows, fields] = await connection.query("SELECT * FROM BBY12Admins");
    
    if (rows.length == 0) {
      let userRecords = "INSERT INTO BBY12Admins (username) values ?";
      let recordValues = [
        ['test']
      ];
      await connection.query(userRecords, [recordValues]);

    } else {
        console.log("Cannot connect and write to database.");
    }
    connection.end();
    console.log("Connected to database. Listening on port 8000!");
  }
  
}

//run server on port
let port = 8000;
app.listen(port, init);