'use strict';
const mysql = require('mysql2');
const { render } = require('express/lib/response');
const { JSDOM } = require('jsdom');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });