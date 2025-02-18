<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Autorization, X-Requested-With');   

include_once '../../config/Database.php';
include_once '../../models/Transaction.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate transaction
$transaction = new Transaction($db);
// Get row Posted data
$data = json_decode(file_get_contents("php://input"));
// Set ID to update
$transaction->id = $data->id;
$transaction->Current_Price = $data->Current_Price;
$transaction->Increase_Amount = $data->Increase_Amount;
$transaction->Nbr = $data->Nbr;
$transaction->Price_Date = $data->Price_Date;
$transaction->Validated = $data->Validated;
$transaction->User_Id = $data->User_Id;
$transaction->Position_Id = $data->Position_Id;           
$transaction->Created_at = $data->Created_at;
$transaction->Updated_at = $data->Updated_at;


// Update transaction
if ($transaction->updateTransaction()){
    echo json_encode(
        array('message', 'Transaction Modifié avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Transaction Non Modifié ')
    );
}
