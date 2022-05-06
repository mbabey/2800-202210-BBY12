'use strict';

module.exports = {
    dbInitialize: async function() {
        const mysql = require('mysql2/promise');
        const con = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true
        });
        initDB(con)
            .then((results) => {;
            })
            .catch((err) => {
                return false;
            });
    }
}

async function initDB(con) {
    let firstInit = true;
    await con.query(`
            CREATE DATABASE IF NOT EXISTS COMP2800;
            USE COMP2800;
            CREATE TABLE IF NOT EXISTS \`BBY-12-Users\` (
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                fName VARCHAR(255),
                lName VARCHAR(255),
                cName VARCHAR(255),
                bType VARCHAR(255),
                email VARCHAR(255),
                phoneNo VARCHAR(255),
                location VARCHAR(255),
                description LONGTEXT,
                profilePic VARCHAR(255),
                PRIMARY KEY (username)
            );
            
            CREATE TABLE IF NOT EXISTS \`BBY-12-Post\` (
                username VARCHAR(255) NOT NULL,
                postId INT NOT NULL UNIQUE,
                postTitle VARCHAR(255),
                timestamp DATETIME,
                content MEDIUMTEXT,
                PRIMARY KEY (username , postid),
                CONSTRAINT FK_PostUsername FOREIGN KEY (username) REFERENCES \`BBY-12-Users\` (username)
            );
            
            CREATE TABLE IF NOT EXISTS \`BBY-12-PostImg\` (
                username VARCHAR(255) NOT NULL,
                postId INT NOT NULL,
                imgFile VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (username , postid , imgFile),
                CONSTRAINT FK_ImgUsername FOREIGN KEY (username, postId) REFERENCES \`BBY-12-Post\` (username, postId)
            );
                
            CREATE TABLE IF NOT EXISTS \`BBY-12-PostTag\` (
                username VARCHAR(255) NOT NULL,
                postId INT NOT NULL,
                tag VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (username , postid , tag),
                CONSTRAINT FK_TagUsername FOREIGN KEY (username, postId) REFERENCES \`BBY-12-Post\` (username, postId)
            );
            
            CREATE TABLE IF NOT EXISTS \`BBY-12-Admins\` (
                username VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (username),
                CONSTRAINT FK_Admin FOREIGN KEY (username) REFERENCES \`BBY-12-Users\` (username)
            );
            `);
    let [rows, fields] = await con.query('SELECT * FROM \`BBY-12-Users\`;');
    if (rows.length == 0) {
        let records = 'INSERT INTO \`BBY-12-Users\` (username, password, fName, lName, cName, bType, email, phoneNo, location, description, profilePic) VALUES ?;';
        let values = [
            ['test', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Drop', 'Table', 'Gro-Operate', 'Business Cooperation Software', '123@321.com', '(123) 456-7890', 'here, now', 'I am the progenitor of all accounts', 'img.jpg'],
            ['user', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Mike', 'Hawk', 'Birthink Inc.', 'Not-for-profit Think Tank', 'mikey@business.gov', '(123) 456-7890', 'Swift Current, Saskatchewan', 'Birthink Inc. is the reason to get up in the morning; its the reason to go to bed at night.', 'img.jpg']
        ];
        await con.query(records, [values], (err) => {
            if (err);
        });
    } else {
        firstInit = false;
    }
    [rows, fields] = await con.query('SELECT * FROM \`BBY-12-Admins\`;');
    if (rows.length == 0) {
        let records = 'INSERT INTO \`BBY-12-Admins\` VALUES ?;';
        let values = [
            ['test']
        ];
        await con.query(records, [values], (err) => {
            if (err);

        });
    } else {
        firstInit = false;
    }

    [rows, fields] = await con.query('SELECT * FROM \`BBY-12-Post\`;');
    if (rows.length == 0) {
        let records = 'INSERT INTO \`BBY-12-Post\` (username, postId, timestamp, postTitle, content) VALUES ?;';
        let values = [
            ['user', '1', '20220129092203', 'Cafe Looking for Collaborations', 'Hello there, I\'m a cafe owner looking for business collaboration opportunities. My cafe Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby. Please don\'t hesitate to contact me.'],
            ['user', '2', '20220228143215', 'First Collaboration With Olivia Knits', 'Hi, my cafe Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby. Thanks to Olivia Knits and her cute yarn plushies, we are gaining quite some fun customers! There are still empty shelves in the cafe if you\'re looking for a place to present and sell your handicrafts. Please feel free to contact me.'],
            ['user', '3', '20220302175723', 'Second Collaboration With Charlie\'s Pottery', 'Hey there, my cafe Drink To Be Late was honoured to display the cute plushies from Olivia Knits and beautiful works from Charlie\'s Pottery in my cafe. Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby, feel free to drop by! I\'m still open to collaborations with my open shelves! Please don\'t hesitate to contact me.'],
            ['user', '4', '20220406220840', 'Third Collaboration With Betty:Not Dove', 'Hi, cafe Drink To Be Late is super grateful for all the supports and messages from the community! We are now displaying Olivia Knits\' cutest yarn plushies, elegant potteries from Charlie\'s Pottery, and hilarious soap art from Betty:Not Dove. Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby, feel free to drop by! You can also contact me for future collabs.']
        ]
        await con.query(records, [values], (err) => {
            if (err)
            ;
        });
    } else {
        firstInit = false;
    }

    return firstInit;
}