'use strict';

const hostName = 'localhost';
const userName = 'root';
const pass = '';
const db = 'COMP2800';

const mysql = require('mysql2/promise');
const Importer = require('mysql-import');
const importer = new Importer({ host: hostName, user: userName, password: pass });

module.exports = {
    dbInitialize: async () => {
        await initDB();
        importer.use(db);
        /* Code for mysql-import functionality from here: https://github.com/Pamblam/mysql-import */
        importer.onProgress((progress) => {
            let percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
            console.log(`database.sql import ${percent}% complete`);
        });
        importer.import('database.sql').then(() => {
            var filesImported = importer.getImported();
            console.log(`Database initialized: ${filesImported.length} file imported`);
        }).catch(() => {
            console.log('Database already initialized');
        });
    }
}

async function initDB() {
    const con = await mysql.createConnection({
        host: hostName,
        user: userName,
        password: pass,
        multipleStatements: true
    });
    await con.query(`CREATE DATABASE IF NOT EXISTS COMP2800; USE COMP2800;`);
    con.destroy();
}