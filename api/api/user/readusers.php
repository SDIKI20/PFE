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
$result = $user->getUsers();
$num = $result->rowCount();

if ($num > 0 ){
    $users_arr = array();
    $users_arr['data'] = array();
   // $users_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $user_item = array(
             'id' => $id,
             'UserName' => $UserName,
             'Email' => $Email,
             'FName' => $FName,
             'LName' => $LName,
             'Pass'  => $Pass,
             'wilaya_id' => $Wilaya_id,
             'phone' => $Phone,
             'Profile' => $Profile,
             'Subscription' => $Subscription,
             'Start_Date' => $Start_Date, 
             'End_Date' => $End_Date,
             'State' => $State,             
             'level' => $Level,
             'Created_at' => $Created_at,
             'Updated_at' => $Updated_at
        );
        array_push($users_arr['data'], $user_item);
        //array_push($users_arr, $user_item);
       
    }
    echo json_encode($users_arr);
} else {
    echo    json_encode(
        array('message' => 'No Users Found')
    );
}