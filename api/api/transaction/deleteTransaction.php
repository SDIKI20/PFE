<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
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

// Update transaction
if ($transaction->deleteTransaction()){
    echo json_encode(
        array('message', 'Transaction Supprimé avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Transaction Non Supprimé ')
    );
}
