<?php
include(__DIR__ . "/../../../db.php");
class GalleryLogic
{

    public function index()
    {
        include(__DIR__ . "/../../../config.php");

        $db = new DB();
        $connection = $db->hasDBconnection();
        if (!$connection) {
            header("Location:" . $urlbase . "admin/errorserver");
        } else {
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
}
