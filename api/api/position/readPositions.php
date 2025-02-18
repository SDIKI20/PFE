<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Position.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate User
$position = new Position($db);
$result = $position->getPositions();
$num = $result->rowCount();

if ($num > 0 ){
    $positions_arr = array();
    $positions_arr['data'] = array();
   // $positions_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $position_item = array(
             'id' => $id,
             'Position' => $Position,
             'Description' => $Description,
             'Qte' => $Qte,
             'Start_Price' => $Start_Price,
             'Increase_Amount'  => $Increase_Amount,
             'Fixed_Price' => $Fixed_Price,
             'Current_Price' => $Current_Price,
             'Start_Date' => $Start_Date,
             'Close_Date' => $Close_Date,
             'State' => $State, 
             'Owner_Id' => $Owner_Id,
             'Img1' => $Img1,             
             'Img2' => $Img2,
             'Img3' => $Img3,
             'Img4' => $Img4,
             'Created_at' => $Created_at,
             'Updated_at' => $Updated_at
        );
        array_push($positions_arr['data'], $position_item);
        //array_push($positions_arr, $user_item);
       
    }
    echo json_encode($positions_arr);
} else {
    echo    json_encode(
        array('message' => 'Pas de  Positions Trouvées')
    );
}