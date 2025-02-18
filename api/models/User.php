<?php
class User {
    private $conn;
    private $table = "users";

    // propiétées
    public $id;
    public $UserName;
    public $Email;
    public $FName;
    public $LName;
    public $Pass;
    public $Wilaya_id;
    public $Phone;
    public $Profile;
    public $Subscription;
    public $Start_Date;
    public $End_Date;
    public $State;    
    public $Level;
    public $Created_at;
    public $Updated_at;

    public function __construct($db){
        $this->conn = $db;
    }
    public function getUsers(){
        $querry = 'SELECT 
            w.wilaya as wilaya,
            u.*
            FROM 
            ' . $this->table . ' u
            LEFT JOIN 
            wilayas w ON u.wilaya_id = w.id'   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // execut querry
       // var_dump($querry);
        $stmt->execute();
        return $stmt;
    }
    public function read_Single(){
        $querry = 'SELECT 
            w.wilaya as wilaya,
            u.*
            FROM 
            ' . $this->table . ' u
            LEFT JOIN 
            wilayas w ON u.wilaya_id = w.id 
             WHERE u.id = ?
             LIMIT 0,1'   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Bind ID
        $stmt->bindParam(1,$this->id);
        // execut querry
        $stmt->execute();

        $row =  $stmt->fetch(PDO::FETCH_ASSOC);
        // Set Properties
        $this->UserName = $row['UserName'];
        $this->Email = $row['Email'];
        $this->FName = $row['FName'];
        $this->LName = $row['LName'];
        $this->Pass = $row['Pass'];
        $this->Wilaya_id = $row['Wilaya_id'];
        $this->Phone = $row['Phone'];
        $this->Profile = $row['Profile'];
        $this->Subscription = $row['Subscription'];
        $this->Start_Date = $row['Start_Date'];
        $this->End_Date = $row['End_Date'];
        $this->State = $row['State'];        
        $this->Level = $row['Level'];
        $this->Created_at = $row['Created_at'];
        $this->Updated_at = $row['Updated_at'];
        return $row;
    }

    public function createCompte(){
        $querry = 'INSERT INTO ' . $this->table . '  
        SET 
            UserName = :UserName,
            Email = :Email,
            FName = :FName,
            LName = :LName,
            Pass = :Pass,
            Wilaya_id = :Wilaya_id,
            Phone = :Phone,
            Profile = :Profile,
            Subscription = :Subscription,
            Start_Date = :Start_Date,
            End_Date = :End_Date,
            State = :State,            
            Level = :Level,
            Created_at = :Created_at,
            Updated_at = :Created_at';
            
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->UserName = htmlspecialchars(strip_tags($this->UserName));
        $this->Email = htmlspecialchars(strip_tags($this->Email));
        
        $this->FName = htmlspecialchars(strip_tags($this->FName));
        $this->LName = htmlspecialchars(strip_tags($this->LName));
        $this->Pass = htmlspecialchars(strip_tags($this->Pass));
        $this->Wilaya_id = htmlspecialchars(strip_tags($this->Wilaya_id));
        $this->Phone = htmlspecialchars(strip_tags($this->Phone));
        $this->Profile = htmlspecialchars(strip_tags($this->Profile));
        $this->Subscription = htmlspecialchars(strip_tags($this->Subscription));
        $this->Start_Date = htmlspecialchars(strip_tags($this->Start_Date));
        $this->End_Date = htmlspecialchars(strip_tags($this->End_Date));
        $this->State = htmlspecialchars(strip_tags($this->State));       
        $this->Level = htmlspecialchars(strip_tags($this->Level));
        $this->Created_at = htmlspecialchars(strip_tags($this->Created_at));
        $this->Updated_at = htmlspecialchars(strip_tags($this->Updated_at));
        // Bind data
        $stmt->bindParam(':UserName', $this->UserName);
        $stmt->bindParam(':Email', $this->Email);
        
        $stmt->bindParam(':FName', $this->FName);
        $stmt->bindParam(':LName', $this->LName);
        $stmt->bindParam(':Pass', $this->Pass);
        $stmt->bindParam(':Wilaya_id', $this->Wilaya_id);
        $stmt->bindParam(':Phone', $this->Phone);
        $stmt->bindParam(':Profile', $this->Profile);
        $stmt->bindParam(':Subscription', $this->Subscription);
        $stmt->bindParam(':Start_Date', $this->Start_Date);
        $stmt->bindParam(':End_Date', $this->End_Date);
        $stmt->bindParam(':State', $this->State);        
        $stmt->bindParam(':Level', $this->Level);
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
    public function updateCompte(){
        $querry = 'UPDATE  ' . $this->table . '  
        SET 
        UserName = :UserName,
        Email = :Email,
        FName = :FName,
        LName = :LName,
        Pass = :Pass,
        Wilaya_id = :Wilaya_id,
        Phone = :Phone,
        Profile = :Profile,
        Subscription = :Subscription,
        DateDeb = :DateDeb,
        DateFin = :DateFin,
        State = :State,            
        Level = :Level,
        Created_at = :Created_at
        Updated_at = :Created_at
        WHERE id= :id    '   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->UserName = htmlspecialchars(strip_tags($this->UserName));
        $this->Email = htmlspecialchars(strip_tags($this->Email));
        $this->FName = htmlspecialchars(strip_tags($this->FName));
        $this->LName = htmlspecialchars(strip_tags($this->LName));
        $this->Pass = htmlspecialchars(strip_tags($this->Pass));
        $this->Wilaya_id = htmlspecialchars(strip_tags($this->Wilaya_id));
        $this->Phone = htmlspecialchars(strip_tags($this->Phone));
        $this->Profile = htmlspecialchars(strip_tags($this->Profile));
        $this->Subscription = htmlspecialchars(strip_tags($this->Subscription));
        $this->Start_Date = htmlspecialchars(strip_tags($this->Start_Date));
        $this->End_Date = htmlspecialchars(strip_tags($this->End_Date));
        $this->State = htmlspecialchars(strip_tags($this->State));       
        $this->Level = htmlspecialchars(strip_tags($this->Level));
        $this->Created_at = htmlspecialchars(strip_tags($this->Created_at));
        $this->Updated_at = htmlspecialchars(strip_tags($this->Updated_at));
        // Bind data
        $stmt->bindParam(':UserName', $this->UserName);
        $stmt->bindParam(':Email', $this->Email);
        $stmt->bindParam(':FName', $this->FName);
        $stmt->bindParam(':LName', $this->LName);
        $stmt->bindParam(':Pass', $this->Pass);
        $stmt->bindParam(':Wilaya_id', $this->Wilaya_id);
        $stmt->bindParam(':Phone', $this->Phone);
        $stmt->bindParam(':Profile', $this->Profile);
        $stmt->bindParam(':Subscription', $this->Subscription);
        $stmt->bindParam(':Start_Date', $this->Start_Date);
        $stmt->bindParam(':End_Date', $this->End_Date);
        $stmt->bindParam(':State', $this->State);        
        $stmt->bindParam(':Level', $this->Level);
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
    public function deleteCompte(){
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
        
        WHERE UserName = :UserName AND Pass= :Pass '   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->State = htmlspecialchars(strip_tags($this->State));
        $this->id = htmlspecialchars(strip_tags($this->id));
        // Bind data
        $stmt->bindParam(':UserName', $this->UserName);
        $stmt->bindParam(':Pass', $this->Pass);
    
        $stmt->execute();
        return $stmt;
    

}
}