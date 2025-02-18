<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Form</title>
  <link rel="stylesheet" href="signup1.css">
</head>
<body>
  <div class="container">
    <!-- Title section -->
    <div class="title">Registration</div>
    <div class="content">
      <!-- Registration form -->
      <form action="index.html" method="get">
        <div class="user-details">
          <!-- Input for Full Name -->
          <div class="input-box">
            <span class="details">Full Name</span>
            <input type="text" placeholder="Enter your name" required>
          </div>
          <!-- Input for Username -->
          <div class="input-box">
            <span class="details">Username</span>
            <input type="text" placeholder="Enter your username" required>
          </div>
        
          <!-- Input for Phone Number -->
          <div class="input-box">
            <span class="details">Phone Number</span>
            <input type="number" placeholder="Enter your number" required>
          </div>
          <!-- Input for Password -->
          <div class="input-box">
            <span class="details">Password</span>
            <input type="password" placeholder="Enter your password" required>
          </div>
          <!-- Input for Confirm Password -->
          <div class="input-box">
            <span class="details">Confirm Password</span>
            <input type="password" placeholder="Confirm your password" required>
          </div>
        </div>
        <div class="gender-details">
          <!-- Radio buttons for gender selection -->
          <input type="radio" name="gender" id="dot-1">
          <input type="radio" name="gender" id="dot-2">
          <span class="gender-title">Gender</span>
          <div class="category">
            <!-- Label for Male -->
            <label for="dot-1">
              <span class="dot one"></span>
              <span class="gender">Male</span>
            </label>
            <!-- Label for Female -->
            <label for="dot-2">
              <span class="dot two"></span>
              <span class="gender">Female</span>
            </label>
          
          </div>
        </div>
        <!-- Submit button -->
        <div class="button">
          <input type="submit" value="Register">
          <?php
session_start();
if (isset($_SESSION["signup1"]) && $_SESSION["signup1.php"] == "true") {
header("Location: Login.php");
} 
session_destroy();
?>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
