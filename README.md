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

Now you can use this command to run the application
```node login.js```

## In case of errors with database
Can't make connection? Most common error can related to the db connection. Use the following query to fix it.

```ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'toor';```

Where root as your user localhost as your URL and 'toor' as your password
   
Then run this query to refresh privileges.

```flush privileges;```
   
Try connecting using node after you do so.
   
If that doesn't work, try it without @'localhost' part.