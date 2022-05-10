-- drop tables `BBY_12_users`, `BBY_12_post`, `BBY_12_post_img`, `BBY_12_post_tag`, `BBY_12_admins`;
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
    postId INT NOT NULL UNIQUE,
    postTitle VARCHAR(255),
    timestamp DATETIME,
    content MEDIUMTEXT,
    PRIMARY KEY (username , postid),
    CONSTRAINT FK_PostUsername FOREIGN KEY (username) REFERENCES `BBY_12_users` (username)
);

CREATE TABLE IF NOT EXISTS `BBY_12_post_img` (
    username VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    imgFile VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (username , postid , imgFile),
    CONSTRAINT `FK_ImgUsername` FOREIGN KEY (username, postId) REFERENCES `BBY_12_post` (username, postId)
);
    
CREATE TABLE IF NOT EXISTS `BBY_12_post_tag` (
    username VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    tag VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (username , postid , tag),
    CONSTRAINT FK_TagUsername FOREIGN KEY (username, postId) REFERENCES `BBY_12_post` (username, postId)
);

CREATE TABLE IF NOT EXISTS `BBY_12_admins` (
    username VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (username),
    CONSTRAINT FK_Admin FOREIGN KEY (username) REFERENCES `BBY_12_users` (username)
);

INSERT INTO `BBY_12_users`
VALUES ("test", "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", "Drop", "Table", "Gro Operate", "Business Cooperation Software", "123@321.com", "(123) 456-7890", "here, now", "I am the progenitor of all accounts", "img.jpg"); -- Password is "test" run through sha256. Just type "test"!
INSERT INTO `BBY_12_users`
VALUES ("user", "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", "Mike", "Hawk", "Birthink Inc.", "Not-for-profit Think Tank", "mikey@business.gov", "(123) 456-7890", "Swift Current, Saskatchewan", "Birthink Inc. is the reason to get up in the morning; its the reason to go to bed at night.", "img.jpg"); -- Password is "test" run through sha256. Just type "test"!

INSERT INTO `BBY_12_admins` VALUES ("test");

INSERT INTO `BBY_12_post` (username, postId, timestamp, postTitle, content)
VALUES ("user", 1, 20220129092203, "Cafe Looking for Collaborations","Hello there, I\'m a cafe owner looking for business collaboration opportunities. My cafe Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby. Please don\'t hesitate to contact me.");

INSERT INTO `BBY_12_post` (username, postId, timestamp, postTitle, content)
VALUES ("user", 2, 20220228143215, "First Collaboration With Olivia Knits","Hi, my cafe Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby. Thanks to Olivia Knits and her cute yarn plushies, we are gaining quite some fun customers! There are still empty shelves in the cafe if you\'re looking for a place to present and sell your handicrafts. Please feel free to contact me.");

INSERT INTO `BBY_12_post` (username, postId, timestamp, postTitle, content)
VALUES ("user", 3, 20220302175723, "Second Collaboration With Charlie\'s Pottery", "Hey there, my cafe Drink To Be Late was honoured to display the cute plushies from Olivia Knits and beautiful works from Charlie\'s Pottery in my cafe. Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby, feel free to drop by! I\'m still open to collaborations with my open shelves! Please don\'t hesitate to contact me.");

INSERT INTO `BBY_12_post` (username, postId, timestamp, postTitle, content)
VALUES ("user", 4, 20220406220840, "Third Collaboration With Betty:Not Dove", "Hi, cafe Drink To Be Late is super grateful for all the supports and messages from the community! We are now displaying Olivia Knits\' cutest yarn plushies, elegant potteries from Charlie\'s Pottery, and hilarious soap art from Betty:Not Dove. Drink To Be Late is located at the corner of Canada Way and Willingdon Ave. in Burnaby, feel free to drop by! You can also contact me for future collabs.");