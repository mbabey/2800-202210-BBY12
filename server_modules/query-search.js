'use strict';

const queryUser = 'SELECT profilePic, cName, bType, username FROM BBY_12_users WHERE (`username` = ?)';
const queryPost = 'SELECT * FROM BBY_12_post WHERE (`username` = ?) AND (`postId` = ?)';
const queryImgs = 'SELECT imgFile FROM BBY_12_post_img WHERE (`username` = ?) AND (`postId` = ?)';
const queryTags = 'SELECT tag FROM BBY_12_post_tag WHERE (`username` = ?) AND (`postId` = ?)';

module.exports = {

  /**
   * searchPosts. Retrieve all posts that match search term from DB
   * @param {String} search - Search term.
   * @param {Object} con - the connection to the database.
   * @returns posts: Collection of users, posts, images, and tags if no issue, undefined otherwise
   */
  searchPosts: async (search, con) => {
    let posts = [], postIds;
    await con.promise().query('SELECT username, postId FROM BBY_12_POST_TAG WHERE (tag LIKE ?)',
      [search])
      .then((results) => {
        postIds = results[0];
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 0; i < postIds.length; i++) {
      let user = await getData(queryUser, con, postIds[i].username);
      let post = await getData(queryPost, con, postIds[i].username, postIds[i].postId);
      let imgs = await getData(queryImgs, con, postIds[i].username, postIds[i].postId);
      let tags = await getData(queryTags, con, postIds[i].username, postIds[i].postId);
      posts.push({ "user": user, "post": post, "imgs": imgs, "tags": tags });
    }
    return posts;
  },
  
  /**
   * searchUsers. Retrieve all users that match search term from DB
   * @param {String} search - Search term.
   * @param {Object} con - the connection to the database.
   * @returns users: Collection of users if no issue, undefined otherwise
   */
  searchUsers: async (search, con) => {
    let users = [], usernames;
    await con.promise().query('SELECT DISTINCT username FROM BBY_12_POST_TAG WHERE (tag LIKE ?)',
      [search])
      .then((results) => {
        usernames = results[0];
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 0; i < usernames.length; i++) {
      let user = await getData(queryUser, con, usernames[i].username);
      users.push(user);
    }
    return users;
  },

  /**
   * userPosts. Retrieve all posts that match searched username from DB
   * @param {String} search - User to match.
   * @param {Object} con - the connection to the database.
   * @returns posts: Collection of users, posts, images, and tags if no issue, undefined otherwise
   */
  userPosts: async (search, con) => {
    let posts = [], postIds;
    await con.promise().query('SELECT username, postId FROM BBY_12_POST WHERE (username LIKE ?)',
      [search])
      .then((results) => {
        postIds = results[0];
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 0; i < postIds.length; i++) {
      let user = await getData(queryUser, con, postIds[i].username);
      let post = await getData(queryPost, con, postIds[i].username, postIds[i].postId);
      let imgs = await getData(queryImgs, con, postIds[i].username, postIds[i].postId);
      let tags = await getData(queryTags, con, postIds[i].username, postIds[i].postId);
      posts.push({ "user": user, "post": post, "imgs": imgs, "tags": tags });
    }
    return posts;
  }

};

/**
   * getData. Retrieve from DB based on subbmited query and arguments
   * @param {String} query - Query to send to DB.
   * @param {*} args - Additional variables to send to query
   * @param {Object} con - the connection to the database.
   * @returns data: Collection of users, posts, images, and tags if no issue, undefined otherwise
   */
async function getData(query, con, ...args) {
  let data;
  await con.promise().query(query, args)
    .then((results) => {
      data = results[0];
    })
    .catch((err) => {
      console.log(err);
    });

  return data;
}
