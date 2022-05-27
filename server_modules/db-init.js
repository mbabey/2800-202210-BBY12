'use strict';

const mysql = require('mysql2/promise');
const Importer = require('mysql-import');
const { LOCAL_CONFIG } = require('./server-configs');

module.exports = {
  /**
   * dbInitialize. Initialize the database using a sql file import if the server is not Heroku.
   * @param {boolean} isHeroku - true if server is Heroku, false otherwise.
   */
  dbInitialize: async (isHeroku) => {
    if (!isHeroku) {
      await initLocalDB();
      const importer = new Importer(LOCAL_CONFIG());
      /* Code for mysql-import functionality from here: https://github.com/Pamblam/mysql-import */
      importer.import('database.sql').then(() => {
        var filesImported = importer.getImported();
        console.log(`Database initialized: ${filesImported.length} file imported`);
      }).catch(() => {
        console.log('Database already initialized');
      });
    }
  }
};

/**
 * initLocalDB. Initializes localhost database.
 */
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