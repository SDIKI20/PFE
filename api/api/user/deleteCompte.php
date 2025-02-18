<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Autorization, X-Requested-With');   

include_once '../../config/Database.php';
include_once '../../models/User.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate User
$user = new User($db);
// Get row Posted data
$data = json_decode(file_get_contents("php://input"));
// Set ID to update
$user->id = $data->id;

// Update User
if ($user->deleteCompte()){
    echo json_encode(
        array('message', 'Compte Supprimé avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Compte Non Supprimé ')
    );
}
