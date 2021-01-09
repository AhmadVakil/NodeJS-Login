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
  |-- server.js
```

## Get started
In order to create our first database table and insert test account to run the application paste the following to your Mysql workbench or terminal.
```
CREATE DATABASE IF NOT EXISTS `credentials` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `credentials`;

CREATE TABLE IF NOT EXISTS `account` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `picture` TEXT NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `account` (`id`, `username`, `password`, `email`, `picture`) VALUES (1, 'test', 'test', 'test@test.com', 'base64ImageEncodedStringHere');

ALTER TABLE `account` ADD PRIMARY KEY (`id`);
ALTER TABLE `account` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
```

Now you can use this command to run the application
```node server.js```

## In case of errors with database
Can't make connection? Most common error can related to the db connection. Use the following query to fix it.

```ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'toor';```

Where root as your user localhost as your URL and 'toor' as your password
   
Then run this query to refresh privileges.

```flush privileges;```
   
Try connecting using node after you do so.
   
If that doesn't work, try it without @'localhost' part.

## How to delete the MySQL & its databases (Optional)
You might want to delete your database due to data complication after you are done experimenting. For Linux environment follow these instructions.
NOTE! These commands will remove your Mysql files as well, so make sure of what you are doing. 
```
$ sudo apt-get remove --purge mysql-server mysql-client mysql-common -y
$ sudo apt-get autoremove -y
$ sudo apt-get autoclean
$ rm -rf /etc/mysql
# Now delete all MySQL files:
$ sudo find / -iname 'mysql*' -exec rm -rf {} \;
``` 

## How To Install MySQL 8.0 (Optional if you already installed MySQL)
```
$ sudo apt update
$ sudo apt install -y wget
$ wget https://dev.mysql.com/get/mysql-apt-config_0.8.15-1_all.deb
$ sudo dpkg -i mysql-apt-config_0.8.15-1_all.deb
```

After the ```dpkg``` command choose your Linux environment. Select ```<OK>``` and press enter to confirm your version.

Once the repo has been added, update apt index and install mysql-server:

```
$ sudo apt update
$ sudo apt install mysql-community-server
```
Accept license agreement in the next screens and start installation.

Set root password for the MySQL database server.

Select the default authentication plugin.

```Use Strong Password Encryption (RECOMMENDED)```

When asked for root password, provide the password and confirm it to set.

```$ sudo systemctl enable --now mysql```

Now check the status of the server

```systemctl  status  mysql```

The output will be:
```
$ systemctl  status  mysql
   ● mysql.service - MySQL Community Server
        Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: disabled)
        Active: active (running) since Sun 2021-01-03 19:03:34 CET; 2h 10min ago
          Docs: man:mysqld(8)
                http://dev.mysql.com/doc/refman/en/using-systemd.html
       Process: 18566 ExecStartPre=/usr/share/mysql-8.0/mysql-systemd-start pre (code=exited, >
      Main PID: 18605 (mysqld)
        Status: "Server is operational"
         Tasks: 40 (limit: 4572)
        Memory: 214.6M
        CGroup: /system.slice/mysql.service
                └─18605 /usr/sbin/mysqld
```

Now let's check the functionality of our MySQL server by creating ```my_db``` database.
```
    $ sudo mysql -u root -p
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 8
    Server version: 8.0.19 MySQL Community Server - GPL
    Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective owners.
    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    mysql> 
    
    mysql> CREATE DATABASE my_db;
    Query OK, 1 row affected (0.01 sec)
    
    mysql> SHOW DATABASES;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    | my_db              |
    +--------------------+
    5 rows in set (0.01 sec)
    mysql> EXIT
    Bye
```