<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Autorization, X-Requested-With');   


include_once '../../config/Database.php';
include_once '../../models/User.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate User
$user = new User($db);
// Get ID
$data = json_decode(file_get_contents("php://input"));
$user->id = $data->id;
$user->State = $data->State;

// Update User
if ($user->act_des_Compte()){
    echo json_encode(
        array('message', 'Compte Etat Modifié avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Compte Etat Non Modifié ')
    );
}

