<?php
// headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Transaction.php';
// instantiate DB & connect
$database = new Database();
$db = $database->connect();
// instantiate User
$transaction = new Transaction($db);
$result = $transaction->getTransactions();
$num = $result->rowCount();

if ($num > 0 ){
    $transactions_arr = array();
    $transactions_arr['data'] = array();
   // $transactions_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $transaction_item = array(
             'id' => $id,
             'Current_Price' => $Current_Price,
             'Increase_Amount' => $Increase_Amount,
             'Nbr' => $Nbr,
             'Price_Date' => $Price_Date,
             'Validated'  => $Validated,
             'User_Id' => $User_Id,
             'Position_Id' => $Position_Id,
             'Created_at' => $Created_at,
             'Updated_at' => $Updated_at
        );
        array_push($transactions_arr['data'], $transaction_item);
        //array_push($transactions_arr, $user_item);
       
    }
    echo json_encode($transactions_arr);
} else {
    echo    json_encode(
        array('message' => 'Pas de  Transactions Trouvées')
    );
}