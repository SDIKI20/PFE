

<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
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


$user->UserName = $data->UserName;
$user->Email = $data->Email;/*
$user->FName = $data->FName;
$user->LName = $data->LName;
$user->Pass = password_hash($data->Pass, PASSWORD_DEFAULT);
$user->Wilaya_id = $data->Wilaya_id;
$user->Phone = $data->Phone;
$user->Profile = $data->Profile;
$user->Subscription = $data->Subscription;
$user->Start_Date = $data->Start_Date;
$user->End_Date = $data->End_Date;
$user->State = $data->State;
$user->Created_at = $data->Created_at;
$user->Updated_at = $data->Updated_at;
$user->Level = $data->Level;*/
// Create User
if ($user->createCompte()){
    echo json_encode(
        array('message', 'Compte Crée avec Succées')
    );
} else {
    echo json_encode(
        array('message', 'Compte Non Crée ')
    );
}
/*
<?php
$pass = "MotDEPass3";
$pass_hash = password_hash($pass, PASSWORD_DEFAULT);
if (password_verify($pass, $pass_hash))
{
  echo "Mot de passe correct";
}
else
{
  echo "Mot de passe incorrect";
}
?>
*/