<?php

// http://code.tutsplus.com/tutorials/user-membership-with-php--net-1523

session_start();
 
$dbhost = "localhost"; // this will ususally be 'localhost', but can sometimes differ
$dbname = "dots_project"; // the name of the database that you are going to use for this project
$dbuser = "root"; // the username that you created, or were given, to access your database
$dbpass = "root"; // the password that you created, or were given, to access your database
 
$db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_error . ']');
}
// mysqli_select_db($dbname) or die("MySQL Error: " . mysql_error());
?>