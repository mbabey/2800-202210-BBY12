'use strict';

// ------------------------------------------------------ \\
// ------------vvv----- Dependencies -----vvv------------ \\

const express = require('express');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');
const {
  JSDOM
} = require('jsdom');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "." + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    let ext = "." + file.originalname.split('.')[file.originalname.split('.').length - 1];
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      req.fileValidtionError = "Images Only!";
      return callback(null, false, req.fileValidtionError);
    }
    callback(null, true);
  }
});
const server = require('http').Server(app);
const io = require('socket.io')(server);
io.on('connect', socket => {
  console.log('New user joined chat.');
  socket.emit('chat-message', 'Chat up a collab!');
  socket.on('send-message', message => {
    console.log(message);
    socket.emit('chat-message', message);
  });
});

// ---------------- Custom Dependencies ----------------- \\

const createAccount = require('./server_modules/create-account');
const createPost = require('./server_modules/create-post');
const dbInitialize = require('./server_modules/db-init');
const feed = require('./server_modules/feed');
const deleteQueries = require('./server_modules/query-delete');
const loginQuery = require('./server_modules/query-login');
const postQueries = require('./server_modules/query-post');
const searchQueries = require('./server_modules/query-search');
const userQueries = require('./server_modules/query-user');
const resetPassword = require('./server_modules/reset-password');
const { H_CONFIG, LOCAL_CONFIG } = require('./server_modules/server-configs');

// ------------^^^--- End Dependencies ---^^^------------ \\
// ------------------------------------------------------ \\
// ------------vvv----- Server Init ------vvv------------ \\

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));

app.use(session({
  secret: 'shoredoes',
  name: 'groopsess',
  resave: false,
  saveUninitialized: true
}));

let con;
const isHeroku = process.env.IS_HEROKU || false;
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log('Gro-Operate running on ' + port);
  dbInitialize.dbInitialize(isHeroku)
    .then(() => {
      con = (isHeroku) ? mysql.createConnection(H_CONFIG()) : mysql.createConnection(LOCAL_CONFIG());
    }).then(() => {
      con.connect((err) => {
        if (err) throw err;
      });
    });
});

// ------------^^^--- End Server Init ----^^^------------ \\
// ------------------------------------------------------ \\
// ------------vvv-------- Server ---------vvv----------- \\

// ROOT
app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    if (req.session.admin)
      res.redirect('/admin-manage-users');
    else
      res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

// TEMPLATES: NAV, FOOTER, SEARCH OVERLAY
const navbarHTML = fs.readFileSync('./views/chunks/nav.xml', 'utf8');
const footerHTML = fs.readFileSync('./views/chunks/footer.xml', 'utf8');
const searchOverlayHTML = fs.readFileSync('./views/chunks/search-overlay.xml', 'utf8');

// LOGIN
app.route('/login')
  .get((req, res) => {
    if (!req.session.loggedIn) {
      let loginPage = new JSDOM(fs.readFileSync('./views/login.html', 'utf8').toString());
      res.send(loginPage.serialize());
    } else {
      res.redirect('/');
    }
  })
  .post(async (req, res,) => {
    let user = req.body.username.trim();
    let pass = req.body.password;
    res.setHeader('content-type', 'application/json');

    let result = await loginQuery.login(req, user, pass, con);
    req = result.request;
    res.send({ status: result.status });
  });

// LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// GET SESSION ISADMIN BOOLEAN
app.get('/is-admin', (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.send({
    admin: req.session.admin
  });
});

// HOME PAGE
app.get('/home', async (req, res) => {
  if (req.session.loggedIn) {
    let homeDOM = new JSDOM(fs.readFileSync('./views/home.html', 'utf8').toString());
    let templateDOM = new JSDOM(fs.readFileSync('./views/templates.html', 'utf8').toString());
    await feed.populateFeed(req, homeDOM, templateDOM, con)
      .then((result) => {
        homeDOM = result;
      })
      .catch((reject) => {
        console.log(reject);
      });
    let [results] = await con.promise().query(`SELECT profilePic FROM BBY_12_users WHERE username = ?`, [req.session.username]);
    homeDOM.window.document.querySelector('#profile-picture').src = './avatars/' + results[0].profilePic;
    homeDOM.window.document.getElementsByTagName("title").innerHTML = "Gro-Operate | " + req.session.fName + "'s Home Page";
    homeDOM.window.document.querySelector(".profile-name-spot").innerHTML = req.session.username;
    homeDOM.window.document.querySelector('nav').innerHTML = navbarHTML;
    homeDOM.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
    res.send(homeDOM.serialize());
  } else {
    res.redirect("/");
  }
});

// PROFILE
app.get('/profile', async (req, res) => {
  if (req.session.loggedIn) {
    let profileDOM = new JSDOM(fs.readFileSync('./views/profile.html', 'utf8').toString());
    let templateDOM = new JSDOM(fs.readFileSync('./views/templates.html', 'utf8').toString());
    await feed.populateProfileFeed(req, profileDOM, templateDOM, con)
    .then((result) => {
      profileDOM = result;
    })
    .catch((reject) => {
      console.log(reject);
    });
    profileDOM.window.document.querySelector('nav').innerHTML = navbarHTML;
    profileDOM.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
    res.send(profileDOM.serialize());
  } else {
    res.redirect('/');
  }
});

// OTHER USER'S PROFILE
// Other user URL in the form './profile?user=[username]'
app.get('/users', (req, res) => {
  //need to redirect the page if the id doesn't exist
  if (req.session.loggedIn) {
    if (req.session.username == req.query.user) {
      res.redirect('/profile?user=' + req.session.username);
    } else {
      let otherProfilePage = new JSDOM(fs.readFileSync('./views/other-user-profile.html', 'utf8').toString());
      otherProfilePage.window.document.querySelector('nav').innerHTML = navbarHTML;
      otherProfilePage.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
      res.send(otherProfilePage.serialize());
    }
  } else {
    res.redirect('/');
  }
});

// SEARCH FOR POSTS
app.get("/search", (req, res) => {
  if (req.session.loggedIn) {
    let searchPage = new JSDOM(fs.readFileSync('./views/search.html', 'utf8').toString());
    searchPage.window.document.querySelector('nav').innerHTML = navbarHTML;
    searchPage.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
    res.send(searchPage.serialize());
  } else {
    res.redirect('/');
  }
});

// GET TEMPLATE FOR POSTS 
app.get('/get-template', (req, res) => {
  let templates = fs.readFileSync('./views/templates.html', 'utf8').toString();
  res.setHeader('content-type', 'application/json');
  res.send({ dom: templates });
});

// CREATE POST
app.route("/create-post")
  .get((req, res) => {
    if (req.session.loggedIn) {
      let createPostPage = new JSDOM(fs.readFileSync('./views/create-post.html', 'utf8').toString());
      createPostPage.window.document.querySelector('nav').innerHTML = navbarHTML;
      createPostPage.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
      res.send(createPostPage.serialize());
    } else {
      res.redirect('/');
    }
  })
  .post(upload.array('image-upload'), (req, res) => {
    if (req.session.loggedIn && !req.fileValidtionError) {
      createPost.createPost(req, res, storage, con)
        .then((resolve) => {
          if (req.files.length > 0) {
            req.files.forEach(async image => {
              let oldPath = image.path;
              let newPath = "./views/images/" + image.filename;
              fs.rename(oldPath, newPath, function (err) {
                if (err) throw err;
              });
            });
          }
          res.redirect('/home');
        })
        .catch((err) => {
          res.redirect('back');
        });
    } else {
      res.redirect('back');
    }
  });

// CREATE ACCOUNT
app.route('/create-account')
  .get((req, res) => {
    if (!req.session.loggedIn) {
      let createAccountPage = new JSDOM(fs.readFileSync('./views/create-account.html', 'utf8').toString());
      res.send(createAccountPage.serialize());
    } else {
      res.redirect('/');
    }
  })
  .post((req, res) => {
    createAccount.createAccount(req, res, con)
      .then(() => {
        login(req, req.body["username"]);
        res.redirect('/');
      })
      .catch((err) => {
        res.redirect('/create-account');
      });
  });

// RESET PASSWORD
app.route("/reset-password")
  .get((req, res) => {
    if (req.session.loggedIn) {
      let resetPasswordPage = new JSDOM(fs.readFileSync('./views/reset-password.html', 'utf8').toString());
      resetPasswordPage.window.document.querySelector('nav').innerHTML = navbarHTML;
      resetPasswordPage.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
      res.send(resetPasswordPage.serialize());
    }
  })
  .post((req, res) => {
    if (req.session.loggedIn) {
      resetPassword.resetPassword(req, res, con)
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          res.redirect("/reset-password");
        });
      //Add some token for reset confirmation
    }
  });

// ADMIN MANAGE USERS
app.get('/admin-manage-users', (req, res) => {
  if (req.session.loggedIn && req.session.admin) {
    let adminManageAcc = new JSDOM(fs.readFileSync('./views/admin-manage-users.html', 'utf8').toString());
    adminManageAcc.window.document.querySelector('nav').innerHTML = navbarHTML;
    adminManageAcc.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
    res.send(adminManageAcc.serialize());
  } else {
    res.redirect('/');
  }
});

// ADMIN ADD ACCOUNT
app.route('/admin-add-account')
  .get((req, res) => {
    if (req.session.loggedIn && req.session.admin) {
      let accountAddPage = new JSDOM(fs.readFileSync('./views/admin-add-account.html', 'utf8').toString());
      accountAddPage.window.document.querySelector('nav').innerHTML = navbarHTML;
      accountAddPage.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
      res.send(accountAddPage.serialize());
    } else {
      res.redirect('/');
    }
  })
  .post((req, res) => {
    if (req.body.isAdmin) {
      createAccount.createAdmin(req, res, con)
        .then(() => {
          res.redirect('/admin-manage-users');
        })
        .catch(() => {
          res.redirect('/admin-add-account');
        });
    } else {
      createAccount.createAccount(req, res, con)
        .then(() => {
          res.redirect('/admin-manage-users');
        })
        .catch(() => {
          res.redirect('/admin-add-account');
        });
    }
  });

// CHAT PAGE
app.get('/chat', (req, res) => {
  if (req.session.loggedIn) {
    let chatPage = new JSDOM(fs.readFileSync('./views/chat.html', 'utf8').toString());
    chatPage.window.document.querySelector('nav').innerHTML = navbarHTML;
    chatPage.window.document.querySelector('footer').innerHTML = footerHTML + searchOverlayHTML;
    res.send(chatPage.serialize());
  } else {
    res.redirect('/');
  }
});

// EGG
app.get('/egg', (req, res) => {
  let eggDOM = new JSDOM(fs.readFileSync('./views/egg.html', 'utf8'));
  res.send(eggDOM.serialize());
});

// QUERY: GET ALL USERS' INFORMATION
app.get('/get-all-users', async (req, res) => {
  let users = await userQueries.getAllUser(con);
  res.setHeader('content-type', 'application/json');
  res.send({ status: "success", rows: users, thisUser: req.session.username });
});

// QUERY: GET LOGGED IN USER'S INFORMATION
app.get('/get-user', async (req, res) => {
  let user = await userQueries.getUser(req.session.username, con);
  res.setHeader('content-type', 'application/json');
  res.send(user);
});

// QUERY: GET USER OTHER USER'S INFO
app.get('/get-other-user', async (req, res) => {
  let user = await userQueries.getUser(req.query.user, con);
  res.setHeader('content-type', 'application/json');
  res.send(user);
});

// QUERY: GET POST FROM ID AND USERNAME
app.get('/get-post/:username/:postId', async (req, res) => {
  let postContent = await postQueries.getPost(req, con);
  let postImgs = await postQueries.getImgs(req, con);
  let postTags = await postQueries.getTags(req, con);
  res.setHeader('content-type', 'application/json');
  res.send([postContent, postImgs, postTags]);
});


// QUERY: UPDATE USER INFORMATION
app.post('/update-user', async (req, res) => {
  if (req.session.loggedIn) {
    let status = await userQueries.updateUser(req, con);
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: status });
  }
});

// QUERY: UPLOAD PROFILE AVATAR
app.post("/edit-avatar", upload.single('edit-avatar'), (req, res) => {
  if (req.session.loggedIn && !req.fileValidtionError) {
    con.query('UPDATE BBY_12_users SET profilePic = ? WHERE username = ?', [req.file.filename, req.session.username],
      function (err) {
        if (err) throw err;
      });
    let oldPath = req.file.path;
    let newPath = "./views/avatars/" + req.file.filename;
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err;
    });
  }
  res.redirect("/profile");
});

// QUERY: UPDATE USER INFORMATION AS ADMIN
app.post('/admin-edit-user', async (req, res) => {
  if (req.session.loggedIn && req.session.admin) {
    let status = await userQueries.updateUser(req, con);
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: status });
  }
});

// QUERY: GET ALL ADMINS
app.get('/get-all-admins', async (req, res) => {
  try {
    let admins = await userQueries.getAllAdmin(con);
    res.setHeader('content-type', 'application/json');
    res.send({ status: "success", rows: admins });
  } catch (err) {
    throw "Query to database failed.";
  }
});

// QUERY: UPGRADE USER ACCOUNT TO ADMIN ACCOUNT
app.post('/make-admin', async (req, res) => {
  if (req.session.loggedIn && req.session.admin) {
    let [rows, fields] = await userQueries.insertAdmin(req, con);
    let newAdmin = (rows.affectedRows) ? true : false;
    res.setHeader('Content-Type', 'application/json');
    res.send({ adminCreated: newAdmin });
  }
});

// QUERY: DOWNGRADE ADMIN ACCOUNT TO USER ACCOUNT
app.post('/delete-admin', async (req, res) => {
  if (req.session.loggedIn && req.session.admin) {
    let adminCount = await userQueries.countAdmin(con);
    let results = { adminX: false, finalAdmin: false };

    if (req.session.username == req.body.username) {
      results.adminX = true;
      results.finalAdmin = true;
    } else if (adminCount[0].numAdmins > 1) {
      let [rows, fields] = await userQueries.deleteAdmin(req, con);
      if (rows.affectedRows)
        results.adminX = true;
    } else {
      results.finalAdmin = true;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(results);
  }
});

// QUERY: DELETE USER
app.post('/delete-user', async (req, res) => {
  if (req.session.loggedIn && req.session.admin) {
    let results = { adminX: false, userX: false, finalAdmin: false, finalUser: false };

    if (req.session.username == req.body.username) {
      results.adminX = true;
      results.userX = true;
      results.finalAdmin = true;
      results.finalUser = true;
    } else {
      let adminCount = await userQueries.countAdmin(con);
      let userCount = await userQueries.countUser(con);

      if (userCount[0].numUsers > 1) {
        if (adminCount[0].numAdmins > 1) {
          let [rows, fields] = await userQueries.deleteAdmin(req, con);
          if (rows.affectedRows)
            results.adminX = true;
        }
        try {
          let [rows, fields] = await userQueries.deleteUser(req, con);
          if (rows.affectedRows)
            results.userX = true;
        } catch (err) {
          console.log(err);
          results.finalAdmin = true;
        }
      } else {
        results.finalUser = true;
      }
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(results);
  }
});

//QUERY: ADMIN EDIT USER PROFILE SEARCH
app.post('/search-user', async (req, res) => {
  let status, msg;
  let user = await userQueries.getUser(req.body.username, con);
  (user.length > 0) ? status = 'success' : (status = "fail", msg = "Search Fail");
  res.setHeader('content-type', 'application/json');
  res.send({ status: status, rows: user, msg: msg });
});

// QUERY: UPDATE POST WITH GIVEN INFO
app.post('/edit-post', upload.array('image-upload'), async (req, res) => {
  await postQueries.updatePost(req, con);
  await deleteQueries.deleteTags(req, con);
  await postQueries.updateTags(req, con);
  if (req.body["image-delete"]) {
    await postQueries.deleteImgs(req, con);
  }
  if (req.files.length > 0) {
    req.files.forEach(async image => {
      let oldPath = image.path;
      let newPath = "./views/images/" + image.filename;
      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err;
      });
    });
  }
  await postQueries.updateImgs(req, con);
  res.setHeader('content-type', 'application/json');
  res.send({ ayy: 'lmao' });
});

//QUERY: DELETE POST
app.post('/delete-post', upload.none(), async (req, res) => {
  await deleteQueries.deleteTags(req, con);
  await deleteQueries.deleteImgs(req, con);
  await deleteQueries.deletePost(req, con);
});

// QUERY GET USERS BY SEARCH TERM
// TODO: COMBINE WITH GET-USER
app.get('/get-filter-users', async (req, res) => {
  let users = await searchQueries.searchUsers(req.query.search, con);
  res.setHeader('content-type', 'application/json');
  res.send({ users: users });
});

// QUERY GET POSTS BY SEARCH TERM
app.get('/get-filter-posts', async (req, res) => {
  let posts = await searchQueries.searchPosts(req.query.search, con);
  res.setHeader('content-type', 'application/json');
  res.send({ posts: posts });
});

app.get('/get-session', (req, res) => {
  let session = req.session;
  res.setHeader('content-type', 'application/json');
  res.send({ session: session });
});

// QUERY GET POSTS BY USERNAME
app.get('/get-user-posts', async (req, res) => {
  let posts = await searchQueries.userPosts(req.query.user, con);
  res.setHeader('content-type', 'application/json');
  res.send({ posts: posts });
});
