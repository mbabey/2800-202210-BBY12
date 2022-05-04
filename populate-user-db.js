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
        password: "",
        multipleStatements: true
    });

    //create the database if not exist and create table for users
    const createDBAndUserTable = `CREATE DATABASE IF NOT EXISTS comp2800;
        use comp2800;
        CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        fName VARCHAR(255),
        lName VARCHAR(255),
        email VARCHAR(255),
        phoneNo VARCHAR(255),
        description LONGTEXT,
        profilePic VARCHAR(255),
        PRIMARY KEY (username));`;
    await connection.query(createDBAndUserTable);

    const [rows, fields] = await connection.query("SELECT * FROM users");
    if (rows.length == 0) {
        let userRecords = "insert into users (username, password, fName, lName, email, phoneNo, description, profilePic) values ?";
        let recordValues = [
            ["oliviabrown", "demodemo", "Olivia", "Brown", "oliviabrown@123.com", "604-256-3453", "", ""],
            ["btyyn", "demodemo", "Betty", "Nguyen", "bnguyen@bcit.ca", "604-256-2391", "", ""],
            ["carolinelin", "demodemo", "Caroline", "Lin", "carolinelin@123.com", "604-256-6958", "", ""],
            ["meimei", "demodemo", "Mei", "Lee", "4town4ever@gmail.com", "604-256-5991", "", ""]
        ];
        //call userRecords, insert recordValues
        await connection.query(userRecords, [recordValues]);
    } else {
        console.log("Cannot connect and write to database.");
    }
    connection.end();
    console.log("Connected to database. Listening on port 8000!");
}

//run server on port
let port = 8000;
app.listen(port, init);