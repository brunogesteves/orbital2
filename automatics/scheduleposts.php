<?php


class SchedulePosts
{
    private $conectionDB;





    public function __construct()
    {
        $host = "localhost";
        $password = "u354253299_orbital";
        $username = '9Ha|fclS$O';
        $databse = "u354253299_orbital";
        $this->conectionDB = mysqli_connect($host, $password, $username, $databse);
    }



    public function index()
    {
        $currentDate = new DateTime("now", new DateTimeZone('America/Sao_Paulo'));
        $timeNow = strtotime($currentDate->format('Y-m-d H:i'));
        $statusQuery = "UPDATE posts SET status = 1 WHERE posted_at = $timeNow";
        mysqli_query($this->conectionDB, $statusQuery);
        $selectQuery = "SELECT title, slug from posts WHERE posted_at = $timeNow";
        $result = mysqli_query($this->conectionDB, $selectQuery)->fetch_assoc();

        $data = [
            'message' => $result["title"],
            "link" => "https://orbitaltv.net/app/" . $result["slug"],
            "published" => "true",
            "access_token" => "EAAGa2EgxZCrMBO7yUr249GTCgOgt2WNbQmto2ZCurNW7tVYaBIjpwewhicXGjGjWlyQ7nqlxQn9wlgX4fyK3pfOIv4yFncoSABu3Clbijsrg3Tj3l8asehxusymtHhurZBT19ZBKDtB7gNiyZCWfArJ7FDxl3XGl3FtR2HRm9ZBjjVCVHcrZCtlsfSAApKd"
        ];

        $ch = curl_init();

        $options = [
            CURLOPT_URL => "https://graph.facebook.com/v18.0/104512705794942_342045265371090/feed",
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_RETURNTRANSFER => 1,
        ];

        curl_setopt_array($ch, $options);

        $postid = curl_exec($ch);

        curl_close($ch);

        $selectQuery = "UPAD title, slug from posts WHERE posted_at = $timeNow";
        $statusQuery = "UPDATE posts SET status = 1 WHERE posted_at = $timeNow";



    }





}

$autoposts = new SchedulePosts();
$autoposts->index();
