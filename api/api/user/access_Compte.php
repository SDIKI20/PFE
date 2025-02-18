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
// Get UserName and Password
$data = json_decode(file_get_contents("php://input"));
// Set ID to update
$user->UserName = $data->UserName;
$user->Pass = $data->Pass;
$result = $user->access_Compte();
$num = $result->rowCount();
// Accces  User
if ($num > 0 ){
    echo json_encode(
        array('message', 'Accéss au  avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Accéss au  avec non Réussi ')
    );
}