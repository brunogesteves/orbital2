<?php
include(__DIR__ . "/../../../db.php");
class AdsLogic
{
    public function index()
    {
        include(__DIR__ . "/../../../config.php");
        $db = new DB();
        $connection = $db->hasDBconnection();
        if (!$connection) {
            header("Location:" . $urlbase . "admin/errorserver");
        } else {
            $getAdContentQuery = "SELECT * FROM ads";
            $result = mysqli_query($connection, $getAdContentQuery);
            $allAds = [];
            while ($row = mysqli_fetch_array($result)) {
                $data["id"] = $row["id"];
                $data["name"] = $row["name"];
                $data["file"] = $row["file"];
                $data["position"] = $row["position"];
                $data["status"] = $row["status"];
                $data["link"] = $row["link"];
                $data["beginTime"] = $row["beginTime"];
                $data["finalTime"] = $row["finalTime"];
                array_push($allAds, $data);
            }

            $posted_at_dates = [];
            foreach ($allAds as $key => $val) {

                $posted_at_dates[$key] = $val['posted_at'];
            }
            array_multisort($posted_at_dates, SORT_DESC, $allAds);
            return $allAds;
        }
    }

    public function getImages()
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