CREATE TABLE IF NOT EXISTS `BBY_12_users` (
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fName VARCHAR(255),
    lName VARCHAR(255),
    cName VARCHAR(255),
    bType VARCHAR(255),
    email VARCHAR(255),
    phoneNo VARCHAR(255),
    location VARCHAR(255),
    description LONGTEXT,
    profilePic VARCHAR(255),
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS `BBY_12_post` (
    username VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    postTitle VARCHAR(255),
    timestamp DATETIME,
    content MEDIUMTEXT,
    PRIMARY KEY (username , postid),
    CONSTRAINT FK_PostUsername FOREIGN KEY (username) REFERENCES `BBY_12_users` (username)
);

CREATE TABLE IF NOT EXISTS `BBY_12_post_img` (
    username VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    imgFile VARCHAR(255) NOT NULL,
    PRIMARY KEY (username , postid , imgFile),
    CONSTRAINT `FK_ImgUsername` FOREIGN KEY (username, postId) REFERENCES `BBY_12_post` (username, postId)
);
    
CREATE TABLE IF NOT EXISTS `BBY_12_post_tag` (
    username VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    PRIMARY KEY (username , postid , tag),
    CONSTRAINT FK_TagUsername FOREIGN KEY (username, postId) REFERENCES `BBY_12_post` (username, postId)
);

CREATE TABLE IF NOT EXISTS `BBY_12_admins` (
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (username),
    CONSTRAINT FK_Admin FOREIGN KEY (username) REFERENCES `BBY_12_users` (username)
);
