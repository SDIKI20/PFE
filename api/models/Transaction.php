<?php
class Transaction {
    private $conn;
    private $table = "transactions";

    // propiétées
    public $id;
    public $Current_Price;
    public $Increase_Amount;
    public $Nbr;
    public $Price_Date;
    public $Validated;
    public $User_Id;
    public $Position_Id;
    public $Created_at;
    public $Updated_at;

    public function __construct($db){
        $this->conn = $db;
    }
    public function getTransactions(){
        $querry = 'SELECT 
            u.UserName as UserNmae,
            p.Position as Position,
            t.*
            FROM 
            ' . $this->table . ' t
            LEFT JOIN 
            users u ON t.User_Id = u.id 
            LEFT JOIN
            positions  p ON t.Position_Id = p.id 
            '    ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // execut querry
       // var_dump($querry);
        $stmt->execute();
        return $stmt;
    }
    public function read_SingleTransaction(){
        $querry = 'SELECT 
            u.UserName as UserNmae,
            p.Position as Position,
            t.*
            FROM 
            ' . $this->table . ' t
            LEFT JOIN 
            users u ON t.User_Id = u.id 
            LEFT JOIN
            positions  p ON t.Position_Id = p.id                        
             WHERE t.id = ?
             LIMIT 0,1'   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Bind ID
        $stmt->bindParam(1,$this->id);
        // execut querry
        $stmt->execute();

        $row =  $stmt->fetch(PDO::FETCH_ASSOC);
        // Set Properties
        $this->Current_Price = $row['Current_Price'];
        $this->Increase_Amount = $row['Increase_Amount'];
        $this->Nbr = $row['Nbr'];
        $this->Price_Date = $row['Price_Date'];
        $this->Validated = $row['Validated'];
        $this->User_Id = $row['User_Id'];
        $this->Position_Id = $row['Position_Id'];
        $this->Created_at = $row['Created_at'];
        $this->Updated_at = $row['Updated_at'];
        return $stmt;
    }

    public function createTransaction(){
        $querry = 'INSERT INTO ' . $this->table . '  
        SET 
            Current_Price = :Current_Price,
            Increase_Amount = :Increase_Amount,
            Nbr = :Nbr,
            Price_Date = :Price_Date,
            Validated = :Validated,
            User_Id = :User_Id,
            Position_Id = :Position_Id,
            Created_at = :Created_at,
            Updated_at = :Created_at';
           
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->Current_Price = htmlspecialchars(strip_tags($this->Current_Price));
        $this->Increase_Amount = htmlspecialchars(strip_tags($this->Increase_Amount));        
        $this->Nbr = htmlspecialchars(strip_tags($this->Nbr));
        $this->Price_Date = htmlspecialchars(strip_tags($this->Price_Date));
        $this->Validated = htmlspecialchars(strip_tags($this->Validated));
        $this->User_Id = htmlspecialchars(strip_tags($this->User_Id));
        $this->Position_Id = htmlspecialchars(strip_tags($this->Position_Id));
        $this->Created_at = htmlspecialchars(strip_tags($this->Created_at));
        $this->Updated_at = htmlspecialchars(strip_tags($this->Updated_at));
        // Bind data
        $stmt->bindParam(':Current_Price', $this->Current_Price);
        $stmt->bindParam(':Increase_Amount', $this->Increase_Amount);     
        $stmt->bindParam(':Nbr', $this->Nbr);
        $stmt->bindParam(':Price_Date', $this->Price_Date);
        $stmt->bindParam(':Validated', $this->Validated);
        $stmt->bindParam(':User_Id', $this->User_Id);
        $stmt->bindParam(':Position_Id', $this->Position_Id);
        $stmt->bindParam(':Created_at', $this->Created_at);
        $stmt->bindParam(':Updated_at', $this->Updated_at);
       
        // execut querry
        if ($stmt->execute()){
            return true;
        };
        // Print Error if something goes rong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
    public function updateTransaction(){
        $querry = 'UPDATE  ' . $this->table . '  
        SET 
        Current_Price = :Current_Price,
        Increase_Amount = :Increase_Amount,
        Nbr = :Nbr,
        Price_Date = :Price_Date,
        Validated = :Validated,
        User_Id = :User_Id,
        Position_Id = :Position_Id,
        Created_at = :Created_at,
        Updated_at = :Created_at
        WHERE id= :id    '   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->Current_Price = htmlspecialchars(strip_tags($this->Current_Price));
        $this->Increase_Amount = htmlspecialchars(strip_tags($this->Increase_Amount));        
        $this->Nbr = htmlspecialchars(strip_tags($this->Nbr));
        $this->Price_Date = htmlspecialchars(strip_tags($this->Price_Date));
        $this->Validated = htmlspecialchars(strip_tags($this->Validated));
        $this->User_Id = htmlspecialchars(strip_tags($this->User_Id));
        $this->Position_Id = htmlspecialchars(strip_tags($this->Position_Id));
        $this->Created_at = htmlspecialchars(strip_tags($this->Created_at));
        $this->Updated_at = htmlspecialchars(strip_tags($this->Updated_at));
        // Bind data
        $stmt->bindParam(':Current_Price', $this->Current_Price);
        $stmt->bindParam(':Increase_Amount', $this->Increase_Amount);     
        $stmt->bindParam(':Nbr', $this->Nbr);
        $stmt->bindParam(':Price_Date', $this->Price_Date);
        $stmt->bindParam(':Validated', $this->Validated);
        $stmt->bindParam(':User_Id', $this->User_Id);
        $stmt->bindParam(':Position_Id', $this->Position_Id);
        $stmt->bindParam(':Created_at', $this->Created_at);
        $stmt->bindParam(':Updated_at', $this->Updated_at);
        $stmt->bindParam(':id', $this->id);
       
        // execut querry
        if ($stmt->execute()){
            return true;
        };
        // Print Error if something goes rong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // delete Compte
    public function deleteTransaction(){
        $querry = 'DELETE  FROM '. $this->table . ' WHERE id = :id';
        //Prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean Data
        $this->id = htmlspecialchars(strip_tags($this->id));
        // Bind Data
        $stmt->bindParam(':id',$this->id);
        // execut querry
        if ($stmt->execute()){
            return true;
        };
        // Print Error if something goes rong
        printf("Error: %s.\n", $stmt->error);
        return false;    
    }
    //****************************************************************************** */
    public function act_des_Compte(){

                $querry = 'UPDATE  ' . $this->table . '  
                SET 
                    State = :State
                WHERE id= :id    '   ; 
                // prepare statement
                $stmt = $this->conn->prepare($querry);
                // Clean data
                $this->State = htmlspecialchars(strip_tags($this->State));
                $this->id = htmlspecialchars(strip_tags($this->id));
                // Bind data
                $stmt->bindParam(':State', $this->State);
                $stmt->bindParam(':id', $this->id);
            
                // execut querry
                if ($stmt->execute()){
                    return true;
                };
                // Print Error if something goes rong
                printf("Error: %s.\n", $stmt->error);
                return false;
            

    }
    //****************************************************************************** */
    public function access_Compte(){

        $querry = 'SELECT 
        *
        FROM 
        ' . $this->table . '  
        
        WHERE Current_Price = :Current_Price AND Validated= :Validated '   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->State = htmlspecialchars(strip_tags($this->State));
        $this->id = htmlspecialchars(strip_tags($this->id));
        // Bind data
        $stmt->bindParam(':Current_Price', $this->Current_Price);
        $stmt->bindParam(':Validated', $this->Validated);
    
        $stmt->execute();
        return $stmt;
    

}
}