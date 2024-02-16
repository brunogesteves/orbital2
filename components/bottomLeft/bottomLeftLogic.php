<?php

class BottomLeftLogic
{
    public function index()
    {
        include(__DIR__ . "/../../config.php");

        $db = new DB();
        $connection = $db->hasDBconnection();
        if (!$connection) {
            header("Location:" . $urlbase . "error");
        } else {
            $allPosts = [];
            $postsBottomLeft = "SELECT * FROM posts WHERE section = 'n3' AND status=1 order by posted_at desc LIMIT 8";
            $resultsTopLeft = mysqli_query($connection, $postsBottomLeft);
            while ($row = mysqli_fetch_array($resultsTopLeft)) {
                $data["image"] = $row["image"];
                $data["title"] = $row["title"];
                $data["slug"] = $row["slug"];
                array_push($allPosts, $data);
            }
            $autoposts = "SELECT * FROM autposts WHERE section = 'n3' ";
            $autopostsResults = mysqli_query($connection, $autoposts);
            while ($row = mysqli_fetch_array($autopostsResults)) {
                $data["image"] = $row["image"];
                $data["title"] = $row["title"];
                $data["slug"] = $row["slug"];
                array_push($allPosts, $data);
            }
            return $allPosts;
        }
    }


}