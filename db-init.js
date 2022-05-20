'use strict';

// import LOCAL_CONFIG from './server-configs.js';

const mysql = require('mysql2/promise');
const Importer = require('mysql-import');
const { LOCAL_CONFIG } = require('./server-configs');

module.exports = {
    dbInitialize: async (isHeroku) => {
        if (!isHeroku) {
            await initLocalDB();
            const importer = new Importer(LOCAL_CONFIG());
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
}

async function initLocalDB() {
    const con = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        multipleStatements: true
    });
    await con.query(`CREATE DATABASE IF NOT EXISTS COMP2800; USE COMP2800;`);
    con.destroy();
}