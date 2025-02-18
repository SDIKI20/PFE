<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/User.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate User
$user = new User($db);
// Get ID
$user->id = isset($_GET['id']) ? $_GET['id'] : die(); 
// Get User
$user->read_Single();
//var_dump($user);die();
// Create Array
$user_arr = array(
    'id' => $user->id,
    'UserName' => $user->UserName,
    'Email' => $user->Email,
    'FName' => $user->FName,
    'LName' => $user->LName,
    'Pass'  => $user->Pass,
    'wilaya_id' => $user->Wilaya_id,
    'phone' => $user->Phone,
    'Profile' => $user->Profile,
    'Subscription' => $user->Subscription,
    'Start_Date' => $user->Start_Date, 
    'End_Date' => $user->End_Date,
    'State' => $user->State,             
    'level' => $user->Level,
    'Created_at' => $user->Created_at,
    'Updated_at' => $user->Updated_at
);
// Make Json
print_r(json_encode($user_arr));
