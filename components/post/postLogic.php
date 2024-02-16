<?php

class PostLogic
{

    private $exceptionId;
    public function __construct()
    {
        $this->exceptionId;

    }


    public function index($slug)
    {
        include(__DIR__ . "/../../config.php");

        $db = new DB();
        $connection = $db->hasDBconnection();

        $getContentQuery = "SELECT * FROM posts WHERE slug='$slug'";
        $result = mysqli_query($connection, $getContentQuery);
        if (!$result->num_rows) {
            echo "<script type='text/javascript'>window.location.href = '/teste/pagenotfound';</script>";
            exit();
        } else {
            $finalResult = $result->fetch_assoc();
            $GLOBALS['exceptionId'] = $finalResult["id"];
            return $finalResult;

        }

    }

    public function getExceptionId()
    {
        return $GLOBALS['exceptionId'];

    }
}
