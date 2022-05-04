//importing libaries 
const express = require("express");

//initialize express app
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');

//function to create database by running this file in node
async function init() {
    //promise that allows code to execute in a synchronous manner
    const mysql = require("mysql2/promise");

    const connection = await mysql.createConnection({
        //change to 127.0.0.1 for macOS
        host: "localhost",
        user: "root",
        //change password if necessary
        password: "",
        multipleStatements: true
    });
    //create the database if not exist and create table for users
    const createDBAndUserTable = `CREATE DATABASE IF NOT EXISTS grooperate;
        use grooperate;
        CREATE TABLE IF NOT EXISTS user (
        ID int NOT NULL AUTO_INCREMENT,
        user_name varchar(50) NOT NULL,
        first_name varchar(50) NOT NULL,
        last_name varchar(50) NOT NULL,
        email_address varchar(50) NOT NULL,
        password varchar(50) NOT NULL,
        PRIMARY KEY (ID));`;
    await connection.query(createDBAndUserTable);
    const [rows, fields] = await connection.query("SELECT * FROM user");

    if (rows.length == 0) {
        let userRecords = "insert into user (user_name, first_name, last_name, email_address, password) values ?";
        let recordValues = [
            ["oliviabrown", "Olivia", "Brown", "oliviabrown@123.com", "demodemo"],
            ["btyyn", "Betty", "Nguyen", "bnguyen@bcit.ca", "demodemo"],
            ["carolinelin", "Caroline", "Lin", "carolinelin@123.com", "demodemo"],
            ["meimei", "Mei", "Lee", "4town4ever@gmail.com", "demodemo"]
        ];
        //call userRecords, insert recordValues
        await connection.query(userRecords, [recordValues]);
    }

    const createDBAndUserTable2 = `use user;
    CREATE TABLE IF NOT EXISTS user_timeline (
        ID int NOT NULL AUTO_INCREMENT,
        user_ID int NOT NULL,
        business_type varchar(50) NOT NULL,
        business_owner_name varchar(50) NOT NULL,
        business_owner_email_address varchar(50) NOT NULL,
        business_address varchar(10) NOT NULL,
        date_time DATETIME(0) NOT NULL,
        description varchar(500) NOT NULL,
        PRIMARY KEY (ID),
        FOREIGN KEY (user_ID) REFERENCES user(ID) ON UPDATE CASCADE ON DELETE CASCADE);`;
    //SELECT user.ID
    await connection.query(createDBAndUserTable2);
    const [rows2, fields2] = await connection.query("SELECT * FROM user_timeline");

    if (rows2.length == 0) {
        let userRecords = "INSERT into  (INSERT into (ID, user_ID, business_type, business_owner_name, business_owner_email_address, business_address, date_time, description) values ?";
        let recordValues = [
        ];
        //call userRecords, insert recordValues
        await connection.query(userRecords, [recordValues]);
    }


    connection.end();
    console.log("Server is now running on port 8000.");
}

//run server on port
let port = 8000;
app.listen(port, init);