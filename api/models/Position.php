<?php
class Position {
    private $conn;
    private $table = "positions";

    // propiétées
    public $id;
    public $Position;
    public $Description;
    public $Qte;
    public $Start_Price;
    public $Increase_Amount;
    public $Fixed_Price;
    public $Current_Price;
    public $Start_Date;
    public $Close_Date;
    public $State;
    public $Owner_Id;
    public $Img1;    
    public $Img2;    
    public $Img3;    
    public $Img4;    
    public $Created_at;
    public $Updated_at;

    public function __construct($db){
        $this->conn = $db;
    }
    public function getPositions(){
        $querry = 'SELECT 
            u.UserName,
            p.*
            FROM 
            ' . $this->table . ' p
            LEFT JOIN 
            users u ON  p.Owner_Id =  u.id  '   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // execut querry
       // var_dump($querry);
        $stmt->execute();
        return $stmt;
    }
    public function read_SinglePosition(){
        $querry = 'SELECT 
        u.UserName,
        p.*
        FROM 
        ' . $this->table . ' p
        LEFT JOIN 
        users u ON  p.Owner_Id =  u.id  
        WHERE p.id = ?
        LIMIT 0,1'   ; 

        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Bind ID
        $stmt->bindParam(1,$this->id);
        // execut querry
        $stmt->execute();

        $row =  $stmt->fetch(PDO::FETCH_ASSOC);
        //var_dump($row);die();
        // Set Properties
        $this->id = $row['id'];
        $this->Position = $row['Position'];
        $this->Description = $row['Description'];
        $this->Qte = $row['Qte'];
        $this->Start_Price = $row['Start_Price'];
        $this->Increase_Amount = $row['Increase_Amount'];
        $this->Fixed_Price = $row['Fixed_Price'];
        $this->Current_Price = $row['Current_Price'];
        $this->Start_Date = $row['Start_Date'];
        $this->Close_Date = $row['Close_Date'];
        $this->State = $row['State']; 
        $this->Owner_Id = $row['Owner_Id'];          
        $this->Img1 = $row['Img1'];
        $this->Img2 = $row['Img2'];
        $this->Img3 = $row['Img3'];
        $this->Img4 = $row['Img4'];               
        $this->Created_at = $row['Created_at'];
        $this->Updated_at = $row['Updated_at'];
        return $row;
    }

    public function createPosition(){
        $querry = 'INSERT INTO ' . $this->table . '  
        SET 
            Position = :Position,
            Description = :Description ,
            Qte = :Qte,
            Start_Price = :Start_Price,
            Increase_Amount = :Increase_Amount,
            Fixed_Price = :Fixed_Price,
            Current_Price = :Current_Price,
            Start_Date = :Start_Date,
            Close_Date = :Close_Date,
            State = :State,
            Owner_Id = :Owner_Id,
            Img1 = :Img1,            
            Img2 = :Img2,            
            Img3 = :Img3,            
            Img4 = :Img4,                       
            Created_at = :Created_at,
            Updated_at = :Created_at
            ';
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->Position = htmlspecialchars(strip_tags($this->Position));
        $this->Description = htmlspecialchars(strip_tags($this->Description));       
        $this->Qte = htmlspecialchars(strip_tags($this->Qte));
        $this->Start_Price = htmlspecialchars(strip_tags($this->Start_Price));
        $this->Increase_Amount = htmlspecialchars(strip_tags($this->Increase_Amount));
        $this->Fixed_Price = htmlspecialchars(strip_tags($this->Fixed_Price));
        $this->Current_Price = htmlspecialchars(strip_tags($this->Current_Price));
        $this->Start_Date = htmlspecialchars(strip_tags($this->Start_Date));
        $this->Close_Date = htmlspecialchars(strip_tags($this->Close_Date));
        $this->Owner_Id = htmlspecialchars(strip_tags($this->Owner_Id));       
        $this->State = htmlspecialchars(strip_tags($this->State));       
        $this->Img1 = htmlspecialchars(strip_tags($this->Img1));
        $this->Img2 = htmlspecialchars(strip_tags($this->Img2));
        $this->Img3 = htmlspecialchars(strip_tags($this->Img3));
        $this->Img4 = htmlspecialchars(strip_tags($this->Img4));
        $this->Created_at = htmlspecialchars(strip_tags($this->Created_at));
        $this->Updated_at = htmlspecialchars(strip_tags($this->Updated_at));
        // Bind data
        $stmt->bindParam(':Position', $this->Position);
        $stmt->bindParam(':Description', $this->Description);
        $stmt->bindParam(':Qte', $this->Qte);
        $stmt->bindParam(':Start_Price', $this->Start_Price);
        $stmt->bindParam(':Increase_Amount', $this->Increase_Amount);
        $stmt->bindParam(':Fixed_Price', $this->Fixed_Price);
        $stmt->bindParam(':Current_Price', $this->Current_Price);
        $stmt->bindParam(':Start_Date', $this->Start_Date);
        $stmt->bindParam(':Close_Date', $this->Close_Date);
        $stmt->bindParam(':State', $this->State);
        $stmt->bindParam(':Owner_Id', $this->Owner_Id);     
        $stmt->bindParam(':Img1', $this->Img1);
        $stmt->bindParam(':Img2', $this->Img2);
        $stmt->bindParam(':Img3', $this->Img3);
        $stmt->bindParam(':Img4', $this->Img4);
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
    public function updatePosition(){
        $querry = 'UPDATE  ' . $this->table . '  
        SET 
        Position = :Position,
        Description = :Description ,
        Qte = :Qte,
        Start_Price = :Start_Price,
        Increase_Amount = :Increase_Amount,
        Fixed_Price = :Fixed_Price,
        Current_Price = :Current_Price,
        Start_Date = :Start_Date,
        Close_Date = :Close_Date,
        State = :State,
        Owner_Id = :Owner_Id,
        Img1 = :Img1,            
        Img2 = :Img2,            
        Img3 = :Img3,            
        Img4 = :Img4,                       
        Created_at = :Created_at,
        Updated_at = :Created_at
        WHERE id= :id    '   ; 
        // prepare statement
        $stmt = $this->conn->prepare($querry);
        // Clean data
        $this->Position = htmlspecialchars(strip_tags($this->Position));
        $this->Description = htmlspecialchars(strip_tags($this->Description));
        $this->Qte = htmlspecialchars(strip_tags($this->Qte));
        $this->Start_Price = htmlspecialchars(strip_tags($this->Start_Price));
        $this->Increase_Amount = htmlspecialchars(strip_tags($this->Increase_Amount));
        $this->Fixed_Price = htmlspecialchars(strip_tags($this->Fixed_Price));
        $this->Current_Price = htmlspecialchars(strip_tags($this->Current_Price));
        $this->Start_Date = htmlspecialchars(strip_tags($this->Start_Date));
        $this->Close_Date = htmlspecialchars(strip_tags($this->Close_Date));
        $this->Owner_Id = htmlspecialchars(strip_tags($this->Owner_Id));
        $this->State = htmlspecialchars(strip_tags($this->State));       
        $this->Img1 = htmlspecialchars(strip_tags($this->Img1));
        $this->Img2 = htmlspecialchars(strip_tags($this->Img2));
        $this->Img3 = htmlspecialchars(strip_tags($this->Img3));
        $this->Img4 = htmlspecialchars(strip_tags($this->Img4));
        $this->Created_at = htmlspecialchars(strip_tags($this->Created_at));
        $this->Updated_at = htmlspecialchars(strip_tags($this->Updated_at));
        // Bind data
        $stmt->bindParam(':Position', $this->Position);
        $stmt->bindParam(':Description', $this->Description);
        $stmt->bindParam(':Qte', $this->Qte);
        $stmt->bindParam(':Start_Price', $this->Start_Price);
        $stmt->bindParam(':Increase_Amount', $this->Increase_Amount);
        $stmt->bindParam(':Fixed_Price', $this->Fixed_Price);
        $stmt->bindParam(':Current_Price', $this->Current_Price);
        $stmt->bindParam(':Start_Date', $this->Start_Date);
        $stmt->bindParam(':Close_Date', $this->Close_Date);
        $stmt->bindParam(':Owner_Id', $this->Owner_Id);
        $stmt->bindParam(':State', $this->State);        
        $stmt->bindParam(':Img1', $this->Img1);
        $stmt->bindParam(':Img2', $this->Img2);
        $stmt->bindParam(':Img3', $this->Img3);
        $stmt->bindParam(':Img4', $this->Img4);
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
    public function deletePosition(){
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
    
}