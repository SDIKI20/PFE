<?php
    session_start();
    if(isset($_SESSION['login'])||isset($_SESSION['signup'])){
        header('Location: ../index.php');
    }
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../style/main.css?<?php echo time(); ?>">
    <link rel="stylesheet" href="../style/mobile.css?<?php echo time(); ?>">
    <link rel="stylesheet" href="../style/checkbox.css?<?php echo time(); ?>">
    <link rel="stylesheet" href="../js/lib/node_modules/intl-tel-input/build/css/intlTelInput.min.css?<?php echo time(); ?>">
    <link rel="stylesheet" href="../style/lib/fontawesome/all.min.css?<?php echo time(); ?>"">
    <link rel="stylesheet" href="../style/signup.css?<?php echo time(); ?>">
    <title>Create</title>
</head>
<body>
    <section class="doc">
        <form action="signup.php" class="signupForm" id="signupForm" method="post" autocomplete="off" enctype="multipart/form-data">
            <?php
                if(isset($_POST['Registre'])){
                    $username = $_POST['username'];
                    $password = password_hash($_POST['password'],PASSWORD_DEFAULT);
                    $email = $_SESSION['email'];
                    $fname = $_POST['Fname'];
                    $lname = $_POST['Lname'];
                    $addr = $_POST['addr'];
                    $country = $_POST['country'];
                    $state = $_POST['state'];
                    $city = $_POST['city'];
                    $zcode = $_POST['zcode'];
                    $dateN = $_POST['dateN'];
                    $phone = $_POST['phone'];
                    $fileName = $_FILES["profileImage"]["name"];
                    if($fileName == ""){
                        $repImg = [true, "../img/users/temp.png"];
                    }else{
                        $fileSize = $_FILES["profileImage"]["size"];
                        $tmpName = $_FILES["profileImage"]["tmp_name"];
                        $validImageExtension = ['jpg', 'jpeg', 'png'];
                        $imageExtension = explode('.', $fileName);
                        $imageExtension = strtolower(end($imageExtension));
                        if (!in_array($imageExtension, $validImageExtension)) {
                            $repImg =  [false,"Not valid Image"];
                        } else if ($fileSize > 1000000) {
                            $repImg =  [false,"Image Size Is Too Large"];
                        } else {
                            $regImg = uniqid();
                            $regImg .= '.' . $imageExtension;
                            move_uploaded_file($tmpName, '../img/users/' . $regImg);
                            $repImg = [true,'../img/users/' . $regImg];
                        }
                    }

                    if($repImg[0]){
                        require_once "database.php";
                        $sql = "SELECT * FROM clients WHERE username = '$username'";
                        $result = mysqli_query($conn, $sql);
                        $user = mysqli_fetch_array($result,MYSQLI_ASSOC);
                        if($user){
                            echo"<p class='errorMsg'>Username already exist<span class='btin' onclick='remove()'' >X</span></p>";
                        }else{
                            $sql = "INSERT INTO address (country, state, city, zipcode, address) VALUES (?, ?, ?, ?, ?)";
                            $stmt = mysqli_prepare($conn, $sql);
                            mysqli_stmt_bind_param($stmt, "sssss",$country ,$state ,$city ,$zcode ,$addr);
                            mysqli_stmt_execute($stmt); 
                            $id_address = mysqli_insert_id($conn);
                            $sql = "INSERT INTO infos (nom, prenom, dateN, tel, email, profile_image, personal_address) VALUES (?, ?, ?, ?, ?, ?, ?)";
                            $stmt = mysqli_prepare($conn, $sql);
                            mysqli_stmt_bind_param($stmt, "sssssss",$fname ,$lname ,$dateN ,$phone ,$email ,$repImg[1] ,$id_address);
                            mysqli_stmt_execute($stmt); 
                            $id_infos = mysqli_insert_id($conn);
                            $sql = "INSERT INTO clients (username, passkey, id_informations) VALUES (?, ?, ?)";
                            $stmt = mysqli_prepare($conn, $sql);
                            mysqli_stmt_bind_param($stmt, "sss", $username, $password, $id_infos);
                            mysqli_stmt_execute($stmt); 
                            $id_client = mysqli_insert_id($conn);
    
                            $_SESSION['username'] = $username;
                            $_SESSION['login'] = "true";
                            $_SESSION['signup'] = "true";
                            $_SESSION['type'] = "client";
                            echo'<script> window.location = "../index.php" </script>';
                        }
                    }else{
                        echo"<p class='errorMsg'>".$repImg[1]."<span class='btin' onclick='remove()''>X</span></p>";
                    }
                }
            ?>
            <div class="sidel">
                <div class="sidelHead" id="sidleHead">
                    <div class="pictureConainer" id="pictureConainer">
                        <img src="../assets/images/user.jpg" alt="" class="pictChange" id="pictChange">
                        <input type="file" name="profileImage" id="profileImage" accept=".jpg, .jpeg, .png" hidden>
                    </div>
                </div>
                <div class="sidleBody" id="sidleBody">
                    <div class="inputHolderTwo">
                        <div class="hold">
                            <div class="input-container hold1">
                                <label for="Fname">First Name</label>
                                <input type="text" name="Fname" id="Fname" class="input-info" placeholder="First Name" required>
                            </div>
                        </div>
                        <div class="hold">
                            <div class="input-container hold1">
                                <label for="Lname">Last Name</label>
                                <input type="text" name="Lname" id="Lname" class="input-info" placeholder="Last Name" required>
                            </div>
                        </div>
                    </div>
                    <div class="input-container inpth">
                        <label for="addr">Addres</label>
                        <input type="text" name="addr" id="addr" class="input-info" placeholder="Adress" required>
                    </div>
                    <div class="inputHolderTwo">
                        <div class="hold">
                            <div class="input-container hold1">
                                <label for="country">Country</label>
                                <input type="text" name="country" id="country" class="input-info" placeholder="Country" required>
                            </div>
                        </div>
                        <div class="hold">
                            <div class="input-container hold1">
                                <label for="state">State</label>
                                <input type="text" name="state" id="state" class="input-info" placeholder="State" required>
                            </div>
                        </div>
                    </div>
                    <div class="inputHolderTwo">
                        <div class="hold">
                            <div class="input-container hold1">
                                <label for="city">City</label>
                                <input type="text" name="city" id="city" class="input-info" placeholder="City" required>
                            </div>
                        </div>
                        <div class="hold">
                            <div class="input-container hold1">
                                <label for="zcode">Zipcode</label>
                                <input type="number" name="zcode" id="zcode" class="input-info" placeholder="Zipcode" required>
                            </div>
                        </div>
                    </div>
                    <div class="input-container inpth">
                        <label for="dateN">Birth Day</label>
                        <input type="date" name="dateN" id="dateN" class="input-info" style="width: 40%;" required>
                    </div>
                    <div class="input-container inpth">
                        <label for="phone">Phone</label>
                        <div class="phone-number-selector">
                            <input type="tel" class="input-info" placeholder="Enter phone number" id="phone-number-input" name="phone" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form">
                <div class="formHead">
                    <h1 class="formTitle">Create Account</h1>
                </div>
                <div class="formBody">
                    <div class="input-container">
                        <label for="username">Username</label>
                        <input type="text" name="username" id="username" class="input-info" placeholder="Username" required>
                    </div>
                    <div class="input-container">
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password" class="input-info" placeholder="password" required>
                    </div>
                    <div class="input-container">
                        <label for="rePassword">Repeat Password</label>
                        <input type="password" name="rePassword" id="rePassword" class="input-info" placeholder="Repeat Password" required>
                    </div>
                    <div class="input-container-row2 agree">
                        <div class="checkbox-wrapper-13">
                            <input type="checkbox" require name="agreeTerms" id="agreeTerms" class="agreeTerms">
                        </div>
                        <label for="agreeTerms">Agree Terms</label>
                    </div>
                </div>
                <div class="formFoot">
                    <button type="submit" class="bt bt-hover bt-Primary" name="Registre" id="Registre">Submit <i class="fa-regular fa-paper-plane" style="color:white;"></i></button>
                </div>
            </div>
        </form>
    </section>

    <script src="../js/lib/node_modules/intl-tel-input/build/js/intlTelInput.min.js"></script>
    <script src="../js/main.js"></script>
    <script src="../js/signup.js"></script>
</body>
</html>