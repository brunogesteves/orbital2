<?php

class bottomRightLogic
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
            $postsBottomRight = "SELECT * FROM posts WHERE section = 'n4' AND status=1 order by posted_at desc LIMIT 7";
            $resultsBottomRight = mysqli_query($connection, $postsBottomRight);
            while ($row = mysqli_fetch_array($resultsBottomRight)) {
                $data["image"] = $row["image"];
                $data["title"] = $row["title"];
                $data["source"] = $row["source"];
                $data["slug"] = $row["slug"];
                array_push($allPosts, $data);
            }
            $autoposts = "SELECT * FROM autposts WHERE section = 'n4' ";
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