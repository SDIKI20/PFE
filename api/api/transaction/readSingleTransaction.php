<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/transaction.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate transaction
$transaction = new Transaction($db);
// Get ID
$transaction->id = isset($_GET['id']) ? $_GET['id'] : die(); 
// Get transaction
$transaction->read_SingleTransaction();
// Create Array
$transaction_arr = array(
    'id' => $transaction->id,
    'Current_Price' => $transaction->Current_Price,
    'Increase_Amount' => $transaction->Increase_Amount,
    'Nbr' => $transaction->Nbr,
    'Price_Date' => $transaction->Price_Date,
    'Validated'  => $transaction->Validated,
    'User_Id' => $transaction->User_Id,
    'Position_Id' => $transaction->Position_Id,
    'Created_at' => $transaction->Created_at,
    'Updated_at' => $transaction->Updated_at
);
// Make Json
print_r(json_encode($transaction_arr));
