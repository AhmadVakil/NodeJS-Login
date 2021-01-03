## NodeJS Login, Express, and Session
Simple NodeJS authentication example using Express and MySql.

## What you will be doing
* Establishing a connection to a MySQL database and selecting rows using MySQL queries.

* Creating GET and POST requests with Node.js and Express.

* Sending and receiving data from the client using Node and Express.

* Creating session variables for clients, this will determine if a user is logged in or not.

## Requirements
* MySQL Server

* Node.js

* Express - Install with command: npm install express.

* Express Sessions - Install with command: npm install express-session.

* MySQL for Node.js - Install with command: npm install mysql.


## File Structure
```
\-- credentials
  |-- login.html
  |-- login.js
```

## Get started
In order to create our first database table and insert test account to run the application paste the following to your Mysql workbench or terminal.
```
CREATE DATABASE IF NOT EXISTS `credentials` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `credentials`;

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com');

ALTER TABLE `accounts` ADD PRIMARY KEY (`id`);
ALTER TABLE `accounts` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
```
