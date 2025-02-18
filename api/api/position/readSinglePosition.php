<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Position.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate position
$position = new Position($db);
// Get ID
$position->id = isset($_GET['id']) ? $_GET['id'] : die(); 
// Get position


$result = $position->read_SinglePosition();
//var_dump($result);die();
// Create Array
$position_arr = array(
   // 'id' => $result->$id,
    'Position' => $position->Position,
    'Description' => $position->Description,
    'Qte' => $position->Qte,
    'Start_Price' => $position->Start_Price,
    'Increase_Amount'  => $position->Increase_Amount,
    'Fixed_Price' => $position->Fixed_Price,
    'Current_Price' => $position->Current_Price,
    'Start_Date' => $position->Start_Date,
    'Close_Date' => $position->Close_Date,
    'State' => $position->State, 
    'Owner_Id' => $position->Owner_Id,
    'Img1' => $position->Img1,             
    'Img2' => $position->Img2,
    'Img3' => $position->Img3,
    'Img4' => $position->Img4,
    'Created_at' => $position->Created_at,
    'Updated_at' => $position->Updated_at
);
// Make Json
print_r(json_encode($position_arr));
