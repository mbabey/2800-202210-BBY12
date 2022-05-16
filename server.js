'use strict';

// ------------------------------------------------------ \\
// ------------vvv----- Dependencies -----vvv------------ \\

const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');
const crypto = require('crypto');
const {
  JSDOM
} = require('jsdom');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + file.originalname.split('.')[file.originalname.split('.').length - 1]);
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

// ---------------- Custom Dependencies ----------------- \\

const createAccount = require('./scripts/create-account');
const resetPassword = require('./scripts/reset-password');
const createPost = require('./scripts/create-post');
const dbInitialize = require('./db-init');
const { H_CONFIG, LOCAL_CONFIG } = require('./server-configs');
const feed = require('./scripts/feed');

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
app.listen(port, () => {
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
      res.redirect('/admin-dashboard');
    else
      res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

// LOGIN
app.route('/login')
  .get((req, res) => {
    if (!req.session.loggedIn) {
      let loginPage = fs.readFileSync('./views/login.html', 'utf8');
      res.send(loginPage);
    } else {
      res.redirect('/');
    }
  })
  .post((req, res,) => {
    res.setHeader('content-type', 'application/json');
    let user = req.body.username.trim();
    let pass = req.body.password;
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    try {
      con.query('SELECT * FROM BBY_12_users WHERE (`username` = ?) AND (`password` = ?);', [user, hash], (err, results) => {
        if (results && results.length > 0) {
          login(req, user);
          res.send({ status: 'success' });
        } else {
          res.send({ status: 'fail' });
        }
        if (err) throw err;
      });
    } catch (err) {
      res.redirect('/');
    }
  });

function login(req, user) {
  req.session.loggedIn = true;
  req.session.username = user;
  req.session.admin = false;
  con.query('Select * from (`BBY_12_admins`) Where (`username` = ?)', [user], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.admin = true;
    }
    req.session.save();
  });
}

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
    let homePage = fs.readFileSync('./views/home.html', 'utf8').toString();
    let homeDOM = new JSDOM(homePage);
    await feed.populateFeed(req, homeDOM, con)
    .then((result)=>{
      homeDOM = result;
    })
    .catch((reject) =>{
      console.log(reject);
    });
    homeDOM.window.document.getElementsByTagName("title").innerHTML = "Gro-Operate | " + req.session.fName + "'s Home Page";
    homeDOM.window.document.querySelector(".profile-name-spot").innerHTML = req.session.username;
    homePage = homeDOM.serialize();
    res.send(homePage);
  } else {
    res.redirect("/");
  }
});

// PROFILE
app.get('/profile', (req, res) => {
  if (req.session.loggedIn) {
    let profilePage = fs.readFileSync('./views/profile.html', 'utf8');
    res.send(profilePage);
  } else {
    res.redirect('/');
  }
});

// CREATE POST
app.route("/create-post")
  .get((req, res) => {
    if (req.session.loggedIn) {
      let createPostPage = fs.readFileSync('./views/create-post.html', 'utf8');
      res.send(createPostPage);
    } else {
      res.redirect('/');
    }
  })
  .post(upload.array('image-upload'), (req, res) => {
    if (req.session.loggedIn && !req.fileValidtionError) {
      createPost.createPost(req, res, storage, con)
        .then((resolve) => {
          res.redirect('/home');
        })
        .catch((err) => {
          res.redirect('back');
        });
    } else {
      res.redirect('back')
    }
  });

// CREATE ACCOUNT
app.route('/create-account')
  .get((req, res) => {
    if (!req.session.loggedIn) {
      let createAccountPage = fs.readFileSync('./views/create-account.html', 'utf8');
      res.send(createAccountPage);
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

// ADMIN DASHBOARD
app.get('/admin-dashboard', (req, res) => {
  if (req.session.loggedIn && req.session.admin) {
    let adminDashPage = fs.readFileSync('./views/admin-dashboard.html', 'utf8');
    res.send(adminDashPage);
  } else {
    res.redirect('/');
  }
});

// ADMIN VIEW ACCOUNTS
app.get('/admin-view-accounts', (req, res) => {
  if (req.session.loggedIn && req.session.admin) {
    let adminViewAcc = fs.readFileSync('./views/admin-view-accounts.html', 'utf8');
    res.send(adminViewAcc);
  } else {
    res.redirect('/');
  }
});

// ADMIN ADD ACCOUNT
app.route('/admin-add-account')
  .get((req, res) => {
    if (req.session.loggedIn && req.session.admin) {
      let accountAddPage = fs.readFileSync('./views/admin-add-account.html', 'utf8');
      res.send(accountAddPage);
    } else {
      res.redirect('/');
    }
  })
  .post((req, res) => {
    if (req.body.isAdmin) {
      createAccount.createAdmin(req, res, con)
        .then(() => {
          res.redirect('/admin-dashboard');
        })
        .catch(() => {
          res.redirect('/admin-add-account');
        });
    } else {
      createAccount.createAccount(req, res, con)
        .then(() => {
          res.redirect('/admin-dashboard');
        })
        .catch(() => {
          res.redirect('/admin-add-account');
        });
    }
  });

// QUERY: GET ALL USERS
app.get('/get-all-users', (req, res) => {
  con.query('SELECT * FROM BBY_12_users', (err, results) => {
    if (err) throw "Query to database failed.";
    res.setHeader('content-type', 'application/json');
    res.send({
      status: "success",
      rows: results
    });
  });
});

// QUERY: GET CURRENT USER
app.get('/get-user', (req, res) => {
  con.query('SELECT * FROM `BBY_12_users` WHERE (`username` = ?)', [req.session.username], (error, results, fields) => {
    if (error) throw error;
    res.setHeader('content-type', 'application/json');
    res.send(results);
  });
});

// QUERY: UPDATE USER
app.post('/update-user', (req, res) => {
  con.query('UPDATE BBY_12_users SET cName = ? , fName = ? , lName = ? , bType = ? , email = ? , phoneNo = ? , location = ? , description = ? WHERE username = ?', [req.body.cName, req.body.fName, req.body.lName, req.body.bType, req.body.email, req.body.phoneNo, req.body.location, req.body.description, req.session.username],
    (error) => {
      if (error) throw error;
      res.setHeader('Content-Type', 'application/json');
      res.send({
        status: "Success",
        msg: "User information updated."
      });
    });
});

// QUERY: GET ALL ADMINS
app.get('/get-all-admins', (req, res) => {
  let admins = 'SELECT * FROM BBY_12_admins';
  con.query(admins, (err, results) => {
    if (err) throw "Query to database failed.";
    res.setHeader('content-type', 'application/json');
    res.send({
      status: "success",
      rows: results
    });
  });
});

// QUERY: GET CURRENT USER INFO IF USER IS ADMIN
app.get('/get-admin', (req, res) => {
  if (req.session.loggedIn && req.session.admin == true) {
    let session_username = req.session.username;
    let admins = 'SELECT * FROM BBY_12_users WHERE BBY_12_users.username = ?';
    con.query(admins, [session_username], (err, results) => {
      if (err) throw "Query to database failed.";
      res.setHeader('content-type', 'application/json');
      res.send({
        status: "success",
        rows: results
      });
    });
  }
});

// QUERY: DELETE ADMIN
app.post('/delete-admin', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  con.query('SELECT * FROM BBY_12_admins',
    (err, results) => {
      if (results.length != 1) {
        con.query('DELETE FROM BBY_12_admins WHERE BBY_12_admins.username = ?', [req.body.username],
          (err, results) => {
            if (err) throw "Cannot delete admin if there is only one admin left.";
          })
      } else {
        if (err) throw err;
      }
    });
});

// QUERY: DELETE USER
app.post('/delete-user', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    con.query('SELECT * FROM BBY_12_users',
      (err, results) => {
        if (results.length != 1) {
          try {
            con.query('DELETE FROM BBY_12_users WHERE BBY_12_users.username = ?', [req.body.username],
              (err, results) => {
              })
          } catch (err) { }
        } else {
          if (err) throw "Cannot delete user if there is only one user left.";
        }
      });
  } catch (err) {
    console.log(err);
  }
});

//Upload profile avatar
//TODO: Move code to different file
app.post("/edit-avatar", upload.single('edit-avatar'), (req, res) => {
  if (req.session.loggedIn && !req.fileValidtionError) {
    con.query('UPDATE BBY_12_users SET profilePic = ? WHERE username = ?', [req.file.filename, req.session.username],
      function (err) {
        if (err) throw err;
      });
    let oldPath = req.file.path;
    let newPath = "./views/avatars/" + req.file.filename;
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
    });
  }
  res.redirect("/profile");
});

// RESET PASSWORD
app.route("/reset-password")
  .get((req, res) => {
    let resetPasswordPage = fs.readFileSync('./views/reset-password.html', 'utf8');
    res.send(resetPasswordPage);
  })
  .post((req, res) => {
    resetPassword.resetPassword(req, res, con)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        res.redirect("/reset-password");
      });
    //Add some token for reset confirmation
  });

//ADMIN EDIT USER PAGE
app.route('/admin-edit-user')
  .get((req, res) => {
    if (req.session.loggedIn && req.session.admin) {
      let profilePage = fs.readFileSync('./views/admin-edit-user.html', 'utf8');
      res.send(profilePage);
    } else {
      res.redirect('/');
    }
  })
  .post((req, res) => {
    if (req.body.username) {
      con.query('UPDATE BBY_12_users SET cName = ? , fName = ? , lName = ? , bType = ? , email = ? , phoneNo = ? , location = ? , description = ? WHERE username = ?',
        [req.body.cName, req.body.fName, req.body.lName, req.body.bType, req.body.email, req.body.phoneNo, req.body.location, req.body.description, req.body.username],
        function (error) {
          if (error) throw error;
          res.redirect('/admin-edit-user');
        });
    } else {
      res.redirect('/admin-edit-user');
    }
  });

//QUERY: ADMIN EDIT USER PROFILE SEARCH
app.post('/search-user', (req, res) => {
  if (req.body.username) {
    con.query('SELECT * FROM BBY_12_users WHERE username = ?', [req.body.username],
      function (error, results) {
        if (error) throw error;
        res.setHeader('content-type', 'application/json');
        res.send({
          status: 'success',
          rows: results
        });
      });
  } else {
    res.send({
      status: "fail",
      msg: "Auth Fail"
    });
  }
});