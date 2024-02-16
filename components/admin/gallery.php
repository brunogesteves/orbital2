<?php
include(__DIR__ . "/../../db.php");

class GalleryApi
{

    public function getGallery()
    {
        include(__DIR__ . "/../../config.php");

        $db = new DB();
        $connection = $db->hasDBconnection();


        $allImages = [];
        $getContentQuery = "SELECT * FROM images;";
        $result = mysqli_query($connection, $getContentQuery);
        while ($row = mysqli_fetch_array($result)) {
            $data["name"] = $row["name"];
            array_push($allImages, $data);
        }
        return $allImages;
    }



}



$GalleryApi = new GalleryApi();
header("Content-Type: application/json");

$res = $GalleryApi->getGallery();

$list = [];

$myObj = new stdClass();
$myObj->statusCode = 200;

foreach ($res as $row) {

    array_push($list, [
        "src" => $urlbase . "images/" . $row["name"],
        "name" => $row["name"]
    ]);


}
$myObj->result = $list;
echo json_encode($myObj, JSON_UNESCAPED_SLASHES);


