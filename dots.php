<?php include "base.php"; ?>

<html>
    <head>
        <title>Final Project</title>

        <style>
          body{
            text-align:center;
            background-color:#567;
            color:#FFF;
          }
          canvas{
            background-color:white;
          }
        </style>
    </head>
    <body>
        <h1>Final Project: Dot Lab Extensions</h1>
        <p>Welcome back, <?=$_SESSION['Username']?>!</p>
        <canvas id="canvas" width="1000" height="500" style="border:1px solid #000000;"></canvas>
        <br>

        <button id="clear" accesskey="c"><u>C</u>lear</button>
        <button id="undo" accesskey="u"><u>U</u>ndo</button>
        <button id="replay" accesskey="r"><u>R</u>eplay</button>
	<button id="sequence" accesskey="s"><u>S</u>equence</button>
	<button id="spoke" accesskey="e"><u>E</u>dge</button>

	<br><br>

	<input type = text id = 'newProperty'>
	<button id = 'addProperty' accesskey = 'a'><u>A</u>dd Property</button> 

   <br><br>

	Set
	<select id = "chooseProperty">
		<option selected disabled hidden value=''></option>
		<option value='name'>Name</option>
		<option value='age'>Age</option>
	   	<option value='caption'>Caption</option>
   	</select>
	of
	<select id = "dotOrEdge">
		<option selected disabled hidden value=''></option>
		<option value = 'dot'>Dots</option>
		<option value = 'edge'>Edges</option>
	</select>
	:
	
	<input type = 'text' id = 'propertyValue'>
	<button id = "setProperty" accesskey = 'p'>Set <u>P</u>roperty Value</button>

        <script src="click_location.js"></script>
        <script src="dots.js"></script>
        <script src="keyboard_events.js"></script>
        <script src="button_clicks.js"></script>
	<script src="edge_mode.js"></script>


    <form action="dots.php" method="post" id="form">
        <input style="display:none;" id="saveInfo" type="text" name="saveInfo" />
        <button id="submitButton" type="button" accessKey="s"><u>S</u>ave</button>
        <button id="loadButton" type="button" accessKey="l"><u>L</u>oad</button>
    </form>

    <script>
        document.getElementById("submitButton").onclick = function(e){
            
            // alert("something")
            var dotsString = "["+dots.map(JSON.stringify).toString()+"]"
            console.log(dotsString)

            document.getElementById("saveInfo").value = dotsString
            // document.getElementById("saveInfo").value = '[{x:50, y:50, r:RADIUS, c:"red"}]'

            // document.getElementById("saveInfo").value = 'something'
            document.getElementById("form").submit()

        }

        document.getElementById("loadButton").onclick = function(e){
            clearC()

            <?php

            $sql = "SELECT * FROM users WHERE Username = '".$_SESSION["Username"]."'";
            if(!$result = $db->query($sql)){
              die('There was an error running the query [' . $db->error . ']');
            }

            while($row = $result->fetch_assoc()){
                $_SESSION['Canvas'] = $row["Canvas"];

            } 
            ?>

            dots = eval('<?=$_SESSION["Canvas"]?>')

            drawDots()
        }
    </script>

    <?php 
        //pretty sure this is getting called as often as possible which is definitely not a good thing, but whatever. 
        if (isset($_REQUEST['saveInfo'])) {
            //technically I think you need to update the session variable here as well, not just db
            $sql = "UPDATE users SET Canvas = '".$_REQUEST["saveInfo"]."'";
            //"SELECT * FROM users WHERE Username = '".$username."' AND Password = '".$password."'"
            if ($db->query($sql) === TRUE) {
                echo "Record updated successfully";
            } else {
                echo "Error updating record: " . $db->error;
            }
        }
        else{
            echo "Not set";
        }
    ?>
    </body>
</html>
