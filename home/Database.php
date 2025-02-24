<?php
    $hostName = "localhost";
    $dbuser = "root";
    $dbpassword = "";
    $dbname = "location_voiture";
    $conn = mysqli_connect($hostName,$dbuser,$dbpassword,$dbname);
    if (!$conn) {
        die("somthing went wront;");
    }
?>