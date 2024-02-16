<?php
include(__DIR__ . "/../../../db.php");
class PoststLogic
{
    public function index()
    {
        include(__DIR__ . "/../../../config.php");
        $db = new DB();
        $connection = $db->hasDBconnection();

        $getContentQuery = "SELECT * FROM posts;";
        $result = mysqli_query($connection, $getContentQuery);
        $allPosts = [];
        while ($row = mysqli_fetch_array($result)) {
            $data["title"] = $row["title"];
            $data["image"] = $row["image"];
            $data["summary"] = $row["summary"];
            $data["link"] = $row["link"];
            $data["id"] = $row["id"];
            $data["source"] = $row["source"];
            $data["status"] = $row["status"];
            $data["section"] = $row["section"];
            $data["posted_at"] = $row["posted_at"];
            array_push($allPosts, $data);
        }

        $posted_at_dates = [];
        foreach ($allPosts as $key => $val) {

            $posted_at_dates[$key] = $val['posted_at'];
        }
        array_multisort($posted_at_dates, SORT_DESC, $allPosts);
        return $allPosts;

    }


}