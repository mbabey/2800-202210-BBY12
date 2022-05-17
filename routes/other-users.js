'use strict';

const express = require('express');
const router = express.Router();
const popProfile = require('./other-account');//not sure

router.get("/", (req, res) => {
    
});

router.get('/:id', (req, res) => {
    let otherProfile = fs.readFileSync('./views/other-user-profile.html', 'utf8');
    if(req.session.loggedIn){

    } else {
        res.redirect('/');
    }


    
    res.redirect(otherProfile);
})

router.param("id", (req, res, next, id) => {
    this.apply.use(popProfile);//not sure
    next();
})

module.exports = router;