<?php
class MorePostsLogic
{

  public function index()
  {
    include(__DIR__ . "/../postLogic.php");

    $getExceptionId = new PostLogic();
    $exceptionId = (int) $getExceptionId->getExceptionId();

    include(__DIR__ . "/../../../config.php");
    $db = new DB();
    $connection = $db->hasDBconnection();
    if (!$connection) {
      // header("Location:" . $urlbase . "admin/errorserver");
    } else {
      $randomContentQuery = "SELECT * FROM posts WHERE id != $exceptionId  ORDER BY RAND()
        LIMIT 3";
      $result = mysqli_query($connection, $randomContentQuery);
      $allPosts = [];
      while ($row = mysqli_fetch_array($result)) {
        $data["image"] = $row["image"];
        $data["source"] = $row["source"];
        $data["title"] = $row["title"];
        $data["link"] = $row["link"];
        $data["slug"] = $row["slug"];
        array_push($allPosts, $data);
      }
      return $allPosts;
    }
  }


}
