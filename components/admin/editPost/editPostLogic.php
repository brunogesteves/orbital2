<?php

include(__DIR__ . "/../../../db.php");
class EditPostLogic
{
    public function index($postId)
    {
        include(__DIR__ . "/../../../config.php");

        $db = new DB();
        $connection = $db->hasDBconnection();
        if (!$connection) {
            header("Location:" . $urlbase . "errorserver");
        } else {
            $postQuery = "SELECT * FROM posts WHERE id='$postId'";
            $result = mysqli_query($connection, $postQuery);
            return $result->fetch_assoc();
        }
    }
    public function getImages()
    {
        include(__DIR__ . "/../../../config.php");

        $db = new DB();
        $connection = $db->hasDBconnection();

        $randomContentQuery = "SELECT * FROM images";
        $result = mysqli_query($connection, $randomContentQuery);
        $allImages = [];
        while ($row = mysqli_fetch_array($result)) {
            $data["id"] = $row["id"];
            $data["name"] = $row["name"];
            array_push($allImages, $data);
        }
        return $allImages;

    }


}


?>