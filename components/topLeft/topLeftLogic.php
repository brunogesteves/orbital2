<?php

class TopLeftLogic
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
            $postsTopLeft = "SELECT * FROM posts WHERE section = 'n1' AND status=1 order by posted_at desc LIMIT 2";
            $resultsTopLeft = mysqli_query($connection, $postsTopLeft);
            while ($row = mysqli_fetch_array($resultsTopLeft)) {
                $data["image"] = $row["image"];
                $data["title"] = $row["title"];
                $data["source"] = $row["source"];
                $data["slug"] = $row["slug"];
                array_push($allPosts, $data);
            }
            $autoposts = "SELECT * FROM autposts WHERE section = 'n1' ";
            $autopostsResults = mysqli_query($connection, $autoposts);
            while ($row = mysqli_fetch_array($autopostsResults)) {
                $data["image"] = $row["image"];
                $data["title"] = $row["title"];
                $data["source"] = $row["source"];
                $data["slug"] = $row["slug"];
                array_push($allPosts, $data);
            }
            return $allPosts;
        }
    }


}