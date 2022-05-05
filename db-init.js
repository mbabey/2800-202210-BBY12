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
        let success = initDB(con)
            .then((result) => {
                return result;
            }).catch((err) => {
                console.log("Could not initialize database.\nError: " + err);
                return false;
            });
        return success;
    }
}

async function initDB(con) {
    return new Promise((resolve, reject) => {
        let creation = new Promise(async (resolve, reject) => {
            await con.query(`
            CREATE DATABASE IF NOT EXISTS comp2800;
            USE comp2800;
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
                PRIMARY KEY (username)
            );
            
            CREATE TABLE IF NOT EXISTS BBY12Post (
                username VARCHAR(255) NOT NULL,
                postId INT NOT NULL UNIQUE,
                postTitle VARCHAR(255),
                timestamp DATETIME,
                content MEDIUMTEXT,
                PRIMARY KEY (username , postid),
                CONSTRAINT FK_PostUsername FOREIGN KEY (username) REFERENCES BBY12users (username)
            );
            
            CREATE TABLE IF NOT EXISTS BBY12PostImg (
                username VARCHAR(255) NOT NULL,
                postId INT NOT NULL,
                imgFile VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (username , postid , imgFile),
                CONSTRAINT FK_ImgUsername FOREIGN KEY (username, postId) REFERENCES BBY12Post(username, postId)
            );
                
            CREATE TABLE IF NOT EXISTS BBY12PostTag (
                username VARCHAR(255) NOT NULL,
                postId INT NOT NULL,
                tag VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (username , postid , tag),
                CONSTRAINT FK_TagUsername FOREIGN KEY (username, postId) REFERENCES BBY12Post (username, postId)
            );
            
            CREATE TABLE IF NOT EXISTS BBY12Admins (
                username VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (username),
                CONSTRAINT FK_Admin FOREIGN KEY (username) REFERENCES BBY12Users (username)
            );
            `, (err) => {
                if (err)
                    reject(new Error("Creation failed."));
                else
                    resolve(true);
            });    
        });
    
        let popUsers = new Promise(async (resolve, reject) => {
            let [rows, fields] = await con.query('SELECT * FROM bby12users');
            if (rows.length == 0) {
                let records = 'INSERT INTO BBY12Post (username, postId, timestamp, postTitle, content) VALUES ?';
                let values = [
                    ['test', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Drop', 'Table', "Gro Operate", '123@321.com', '(123) 456-7890', 'here, now', 'I am the progenitor of all accounts', 'img.jpg'],
                    ['user', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Drop', 'Table', "Gro Operate", '123@321.com', '(123) 456-7890', 'here, now', 'I am the progenitor of all accounts', 'img.jpg'],
                ];
                await con.query(records, [values], (err) => {
                    if (err)
                        reject(new Error("Insert into bby12users failed."));
                    else
                        resolve(true);
                });
            }
        });

        let popAdmins = new Promise(async (resolve, reject) => {
            let [rows, fields] = await con.query('SELECT * FROM bby12admins');
            if (rows.length == 0) {
                let records = 'INSERT INTO BBY12admins VALUES ?';
                let values = ['test'];
                await con.query(records, values, (err) => {
                    if (err)
                        reject(new Error("Insert into bby12admins failed."));
                    else
                        resolve(true);
                });
            }
        });
 
        let popPost = new Promise(async (resolve, reject) => {
            let[rows, fields] = await con.query('SELECT * FROM bby12post');
            if (rows.length == 0) {
                let records = 'INSERT INTO BBY12Post (username, postId, timestamp, postTitle, content) VALUES ?';
                let values = [
                    ['user', '1', '20220129092203', 'Cafe Looking for Collaborations', 'Hello there, I\'m a cafe owner looking for business collaboration opportunities. My cafe Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby. Please don\'t hesitate to contact me.'],
                    ['user', '2', '20220228143215', 'First Collaboration With Olivia Knits', 'Hi, my cafe Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby. Thanks to Olivia Knits and her cute yarn plushies, we are gaining quite some fun customers! There are still empty shelves in the cafe if you\'re looking for a place to present and sell your handicrafts. Please feel free to contact me.'],
                    ['user', '3', '20220302175723', 'Second Collaboration With Charlie\'s Pottery', 'Hey there, my cafe Drink To Be Late was honoured to display the cute plushies from Olivia Knits and beautiful works from Charlie\'s Pottery in my cafe. Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby, feel free to drop by! I\'m still open to collaborations with my open shelves! Please don\'t hesitate to contact me.'],
                    ['user', '4', '20220406220840', 'Third Collaboration With Betty:Not Dove', 'Hi, cafe Drink To Be Late is super grateful for all the supports and messages from the community! We are now displaying Olivia Knits\' cutest yarn plushies, elegant potteries from Charlie\'s Pottery, and hilarious soap art from Betty:Not Dove. Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby, feel free to drop by! You can also contact me for future collabs.']
                ]
                await con.query(records, [values], (err) => {
                    if (err)
                        reject(new Error("Insert into bby12post failed."));
                    else
                        resolve(true);
                });
            }
        });

        let promises = [creation, popUsers, popAdmins, popPost];
        let success = true;
        promises.forEach((promise) => {
            if (!promise) 
                success = false;
        });
        if (!success)
            reject(new Error("Database initialization failed."));
        else
            resolve(true);
    });
}