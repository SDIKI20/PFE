<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Autorization, X-Requested-With');   

include_once '../../config/Database.php';
include_once '../../models/Position.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate position
$position = new Position($db);
// Get row Posted data
$data = json_decode(file_get_contents("php://input"));
// Set ID to update

$position->id = $data->id;
$position->Position = $data->Position;
$position->Description = $data->Description;
$position->Qte = $data->Qte;
$position->Start_Price = $data->Start_Price;
$position->Increase_Amount = $data->Increase_Amount;
$position->Fixed_Price = $data->Fixed_Price;
$position->Current_Price = $data->Current_Price;
$position->Start_Date = $data->Start_Date;
$position->Close_Date = $data->Close_Date;
$position->State = $data->State; 
$position->Owner_Id = $data->Owner_Id;          
$position->Img1 = $data->Img1;
$position->Img2 = $data->Img2;
$position->Img4 = $data->Img4;               
$position->Created_at = $data->Created_at;
$position->Updated_at = $data->Updated_at;


// Update position
if ($position->updatePosition()){
    echo json_encode(
        array('message', 'Position Modifié avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Position Non Modifié ')
    );
}
