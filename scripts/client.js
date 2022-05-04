'use strict';
// const express = require('express');

// var client = new net.Socket();
// client.connect(1337, '127.0.0.1', function() {
// 	console.log('Connected');
// 	client.write('Hello, server! Love, Client.');
// });

// client.on('data', function(data) {
// 	console.log('Received: ' + data);
// 	client.destroy(); // kill client after server's response
// });

// client.on('close', function() {
// 	console.log('Connection closed');
// });






// do we need more than one js file for our server?
// Login, Create account (one js file ie startup.js)
// Timeline 
// Profiles
// Posts

// one js file to handle all the routing

// Timeline has Posts

// Classes give the ability to load in information about the user only once, and to store it in a profile obj.
// only POST on user confirmation

/* 
class Timeline {
    array[Post]; // from query
}

class Post {
    poster // from DB
    date // from DB
    time // from DB
    text // from DB
    [pictures] // from DB <-- limit the size of img uploads
}

class Profile {
    id // from DB
    pPic // from DB
    contact // from DB
    location // from DB
    description // from DB
    fName // from DB
    lName // from DB
    email // from DB

    Serverside checking // Don't actually need to save theese on the client
    password // checked against DB
    posts // from DB
        // SELECT (*) FROM (post) WHERE (uid = this.id);
    
}
*/