<?php
    class Database {
        private $host = "localhost";
        private $db_name = "id18251602_enchers";
        private $username = "id18251602_hani";
        private $password = "KaderKader@1967";
      /*  private $db_name = "encheres";
        private $username = "root";
        private $password = "";*/
        private $conn;

        public function connect(){
        
            $this->conn = null;
            try {
                $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name,$this->username, $this->password );
                $this->conn->setattribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);                                         
            } catch(PDOException $e) {
               // echo 'connection error: ' . $e.getMessage();
               var_dump( 'mysql:host=' . $this->host . ';dbname=' . $this->db_name,$this->username, $this->password );
                echo  json_encode(array('message', 'gggggggggggggggg'));
            }
            return $this->conn;
        }
    }
    