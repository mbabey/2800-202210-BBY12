'use strict';

module.exports = {
    populateFeed: (homeDOM, con) => {
        con.query(`SELECT users.profilePic, users.cName, post.*
            FROM \`BBY_12_post\` AS post
            INNER JOIN \`BBY_12_users\` AS users ON (post.username = users.username)
            ORDER BY post.timestamp DESC;`,
        (error, results, fields) => {
            if (error) throw error;
            results.forEach((result) => {
                // get an array of images in the post
                    // convert the array to a string
                // get an array of tags in the post
                    // convert the array to a string
                // build the post using all data
                    //appendchild to the post block
            }); {
                
            }
        });
    }
}