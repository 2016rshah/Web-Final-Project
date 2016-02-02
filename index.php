<?php include "base.php"; ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
<title>Dots - Log In or Sign Up</title>
  <link rel="stylesheet" href="css/loginpage.css">
</head>  
<body>  
<div id="main">

<?php
if(!empty($_SESSION['LoggedIn']) && !empty($_SESSION['Username']))
{
     ?>
 
     <h1>Member Area</h1>
     <p>Thanks for logging in! You are <code><?=$_SESSION['Username']?></code>.</p>
     <a href="logout.php">Feel free to logout</a>
      
     <?php
}
elseif(!empty($_POST['username']) && !empty($_POST['password']))
{
  ;
    $username = $db->escape_string($_POST['username']);
    $password = md5($db->escape_string($_POST['password']));
    
    $sql = "SELECT * FROM users WHERE Username = '".$username."' AND Password = '".$password."'";
    if(!$result = $db->query($sql)){
      die('There was an error running the query [' . $db->error . ']');
  }

    $foundUser = False;
    while($row = $result->fetch_assoc()){
      $foundUser = True;
         
        $_SESSION['Username'] = $username;
        $_SESSION['LoggedIn'] = 1;
         
         //now redirect them where they need to go
        echo "<script>window.location = 'dots.php'</script>";

  } 
    if(!$foundUser)
    {
        echo "<h1>Error</h1>";
        echo "<p>Sorry, your account could not be found. Please <a href=\"index.php\">click here to try again</a>.</p>";
    }
}
else
{
    ?>
     
    <span href="#" class="button" id="toggle-login">Dots</span>
    <div id="login-container">
      <div id="triangle"></div>
      <h1>Login</h1>
      <form method="post" action="index.php" name="loginform" id="loginform">

          <input class="login-input" type="text" name="username" id="username" placeholder="Username" />
          <input class="login-input" type="password" name="password" id="password" placeholder="Password" />
          <input type="submit" name="login" id="login" value="Login" />


      <p>Or <a href="register.php">click here to register!</p>
      </form>
    </div>
     
   <?php
}
?>
 
</div>
</body>
</html>
