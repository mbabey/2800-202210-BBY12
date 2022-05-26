# My Web Application Gro-Operate

* [General info](#general-info)
* [Developers](#developers)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
Gro-Operate is a platform that will set the bar to help small businesses communicate, 
collaborate, and grow together by creating connections, so that ultimately success can bloom.

## Developers
[Betty Nguyen], [A01028857], [Set 1B], [May 27, 2022]
[Maxwell Babey], [A01271687], [Set 2C], [May 27, 2022]
[Caroline Lin], [A01206267], [Set 1B], [May 27, 2022]
[Kyle Ng], [A01017006], [Set 2A], [May 27, 2022]

## Technologies
Technologies used for this project:
* HTML5
* CSS
* Javascript
* Node.js
* Express
* Mysql
* Socket.io
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore                   # Git ignore file
├── package-lock.json            # Node modules and package dependencies file
├── package.json                 # Dependencies file
├── README-git.md                # Git conventions user guide
├── README.md                    # Readme file
└── server.js                    # Server code file to run the application

It has the following subfolders and files:
├── .vscode                      # Folder for vscode settings
├── node_modules                 # Folder for installed node modules and packages
├── scripts                      # Folder for client-side scripts
        └── egg                      # Folder for easter egg
            /Ball.js                     # File for the ping pong ball functions
            /egg.js                      # File for the ping pong functions
            /Paddle.js                   # File for the paddle functions
        /account.js                  # File for editing profile information function
        /admin-manage.js             # File for admin CRUD functions
        /chat.js                     # File for chat function
        /delete-post.js              # File for deleting post function
        /edit-post.js                # File for editing post function
        /form-inputs.js              # File for password visibility toggle function
        /login.js                    # File for login function
        /nav.js                      # File for navbar function
        /other-account.js            # File to read and populate user info
        /reset-password-client.js    # File to reset user password
├── server_modules               # Folder for server-side scripts
        /chat-server.js              # File to connect to socket.io and emit messages
        /create-account.js           # File for user account creation function
        /create-post.js              # File for create post function
        /db-init.js                  # File to initialize database with data
        /feed.js                     # File to populate posts on timeline
        /query-delete.js             # File to query and delete users in the database
        /query-login.js              # File to query and authenticate users in the database
        /query-post.js               # File to query posts and perform CRUD in the database
        /query-search.js             # File to query posts from the database and populate search results
        /query-user.js               # File to query and read or update users in the database
        /reset-password.js           # File to query user passwords and perform CRUD on passwords
        /server-configs.js           # File to connect to database and Heroku
├── uploads                      # Folder for image uploads
├── views                        # Folder for html files
        └── assets                   # Folder for app images
                /chat.png                # Chat icon image
                /favicon.ico             # Favicon image
                /Logo.png                # Gro-operate logo
                /LogoWithTitle.png       # Gro-operate logo with name
        ├── avatars                  # Folder for users' images
        ├── chunks                   # Folder for xml snippets
                /footer.xml              # File for the footer
                /nav.xml                 # File for the navbar
                /search-overlay.xml      # File for the search bar
        ├── images                   # Folder for users' images
        ├── styles                   # Folder for css styles
                /admin-add-account.css   # CSS file for the admin add users page
                /admin-manage-users.css  # CSS file for the admin CRUD page
                /animation.css           # CSS file for some animations on the app
                /chat.css                # CSS file for the chat page
                /create-account.css      # CSS file for the create account page
                /create-post.css         # CSS file for the create post page
                /egg.css                 # CSS file for the easter egg
                /form-inputs.css         # CSS file for form inputs on the app
                /global.css              # CSS file for the app for application to all pages
                /home.css                # CSS file for the home page
                /login.css               # CSS file for the login page
                /other-user-profile.css  # CSS file for the business profile page
                /post.css                # CSS file for the posts
                /profile.css             # CSS file for the user's profile page
                /reset-password.css      # CSS file for the reset password page
                /search.css              # CSS file for the search bar
        /404.html                # HTML file for error page stating that user doesn't exists
        /admin-add-account.html  # HTML file for admin adding users page
        /admin-manage-users.html # HTML file for admin CRUD page
        /chat.html               # HTML file for chat page
        /create-account.html     # HTML file for creating account page
        /create-post.html        # HTML file for creating post page
        /egg.html                # HTML file for easter egg
        /home.html               # HTML file for home page
        /login.html              # HTML file for login page
        /other-user-profile.html # HTML file for business profile of other users pages
        /profile.html            # HTML file for current user's profile page
        /reset-password.html     # HTML file for password reset page
        /search.html             # HTML file for search bar
        /templates.html          # HTML file for post template

```

Tips for file naming files and folders:
* use lowercase with no spaces
* use dashes (not underscore) for word separation