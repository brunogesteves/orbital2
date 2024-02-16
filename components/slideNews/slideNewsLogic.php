<?php

// include(__DIR__ . "/../../../db.php");

class SlideNewsLogic
{
    public function index()
    {
        include(__DIR__ . "/../../../config");
        $db = new DB();
        $connection = $db->hasDBconnection();

        $allPosts = [];
        $postsTopLeft = "SELECT * FROM posts WHERE section = 'n2' AND status=1 order by posted_at desc LIMIT 2";
        $resultsTopLeft = mysqli_query($connection, $postsTopLeft);
        while ($row = mysqli_fetch_array($resultsTopLeft)) {
            $data["image"] = $row["image"];
            $data["title"] = $row["title"];
            $data["source"] = $row["source"];
            $data["slug"] = $row["slug"];
            array_push($allPosts, $data);
        }
        $autoposts = "SELECT * FROM autposts WHERE section = 'n2' limit 2";
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