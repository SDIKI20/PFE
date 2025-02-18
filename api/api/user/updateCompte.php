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
// Get row Posted data
$data = json_decode(file_get_contents("php://input"));
// Set ID to update
$user->id = $data->id;
$user->UserName = $data->UserName;
$user->Email = $data->Email;
$user->FName = $data->FName;
$user->LName = $data->LName;
$user->Pass = $data->Pass;
$user->Wilaya_id = $data->Wilaya_id;
$user->Phone = $data->Phone;
$user->Profile = $data->Profile;
$user->Abonnement = $data->Abonnement;
$user->DateDeb = $data->DateDeb;
$user->DateFin = $data->DateFin;
$user->State = $data->State;
$user->Created_at = $data->Created_at;
$user->Level = $data->Level;
// Update User
if ($user->updateCompte()){
    echo json_encode(
        array('message', 'Compte Modifié avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Compte Non Modifié ')
    );
}
