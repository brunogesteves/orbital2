<?php

class DB
{

    private $host;
    private $password;
    private $username;
    private $databse;

    private $conectionDB;



    // public function __construct()
    // {
    //     $this->host = "31.170.167.204";
    //     $this->password = '9Ha|fclS$O';
    //     $this->username = 'u354253299_orbital';
    //     $this->databse = "u354253299_orbital";
    //     $this->conectionDB = mysqli_connect($this->host, $this->username, $this->password, $this->databse);
    // }

    public function __construct()
    {
        $this->host = "172.22.0.1";
        $this->password = "root";
        $this->username = "root";
        $this->databse = "orb";
        $this->conectionDB = mysqli_connect($this->host, $this->password, $this->username, $this->databse);
    }



    public function hasDBconnection()
    {
        if (!$this->conectionDB) {
            return false;
        } else {
            return $this->conectionDB;
        }
    }




}