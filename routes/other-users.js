'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');


let otherUser;
router.get('/:id', (req, res) => {
    otherUser = req.params.id;
    console.log(otherUser);
    if (req.session.loggedIn) {
    let otherProfile = fs.readFileSync('./views/other-user-profile.html', 'utf8');
    res.send(otherProfile);
  } else {
    res.redirect('/');
  }
});

router.get('/get-other-user', (req, res) => {
  if (otherUser == req.session.username) {
    res.redirect('/profile');
  } else {
    con.query('SELECT * FROM `BBY_12_users` WHERE (`username` = ?)', [otherUser], (error, results, fields) => {
      if (error) throw error;
      res.setHeader('content-type', 'application/json');
      res.send(results);
    });
  }
});

module.exports = router;