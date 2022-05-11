'use strict';

const herokuConConfig = {
    host: 'g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'bvi0o6i4puwihszs',
    password: 't6j3hhjg82p5yi6v',
    database: 'ooesezqo9t1r5sup'
}

const localConConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
};

const mysql = require('mysql2/promise');
const Importer = require('mysql-import');

module.exports = {
    dbInitialize: async (isHeroku) => {
        if (!isHeroku) {
            await initLocalDB();
        }
        const importer = (isHeroku) ? new Importer(herokuConConfig) : new Importer(localConConfig);
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

async function initLocalDB() {
    const con = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        multipleStatements: true
    });
    await con.query(`CREATE DATABASE IF NOT EXISTS COMP2800; USE COMP2800;`);
    con.destroy();
}