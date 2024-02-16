<?php

include(__DIR__ . "/../../db.php");


class SliderAdsLogic
{


  public function index()
  {
    include(__DIR__ . "/../../config.php");
    $db = new DB();
    $connection = $db->hasDBconnection();
    $currentDate = new DateTime("now", new DateTimeZone('America/Sao_Paulo'));
    $timeNow = strtotime($currentDate->format('Y-m-d H:i'));

    $getAdsQuery = "SELECT * FROM ads WHERE status = 1 AND position ='top'  limit 3 ";
    $result = mysqli_query($connection, $getAdsQuery);
    $allAds = [];
    while ($row = mysqli_fetch_array($result)) {
      $data["file"] = $row["file"];
      $data["link"] = $row["link"];
      array_push($allAds, $data);
    }
    return $allAds;

  }
}
