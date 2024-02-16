<?php
include(__DIR__ . "/../../../db.php");
include(__DIR__ . "/../../../config.php");

if (isset($_POST["updateAd"])) {

    $id = $_POST["id"];
    $name = $_POST["name"];
    $file = $_POST["file"];
    $position = $_POST["position"];
    $status = 0;
    $link = $_POST["link"];
    $beginTime = strtotime($_POST["beginTime"]);
    $finalTime = strtotime($_POST["finalTime"]);


    $db = new DB();
    $connection = $db->hasDBconnection();
    $updateAdQuery = "UPDATE ads SET  
         name = '$name',
         file = '$file',
         position ='$position',
         link='$link',
         beginTime=$beginTime,
         finalTime=$finalTime WHERE id=$id";
    $updateAd_run = mysqli_query($connection, $updateAdQuery);
    if ($updateAd_run) {
        header("Location:" . $urlbase . "admin/ads");
    } else {
        header("Location:" . $urlbase . "admin/ads");
        setcookie("message", "Erro ao atualizar o Anúncio ", time() + (60), "/");
    }

} else if (isset($_POST["deleteAd"])) {
    $id = $_POST["id"];
    $db = new DB();
    $connection = $db->hasDBconnection();

    $deletepostQuery = "DELETE FROM ads WHERE id = '$id'";
    $deletepost_run = mysqli_query($connection, $deletepostQuery);
    header("Location:" . $urlbase . "admin/ads");


} else if (isset($_POST["publishAd"])) {

    $id = $_POST["id"];
    $db = new DB();
    $connection = $db->hasDBconnection();

    $deletepostQuery = "UPDATE ads SET status = 1 WHERE id = $id";
    $deletepost_run = mysqli_query($connection, $deletepostQuery);
    header("Location:" . $urlbase . "admin/ads");

} else {

    $name = $_POST["name"];
    $file = empty($_POST["file"]) ? "logo.jpg" : $_POST["file"];
    $position = $_POST["position"];
    $status = 0;
    $link = $_POST["link"];
    $beginTime = strtotime($_POST["beginTime"]);
    $finalTime = strtotime($_POST["finalTime"]);
    $db = new DB();
    $connection = $db->hasDBconnection();
    $addAdQuery = "INSERT INTO ads (name,file,position,status,link,beginTime,finalTime)
                              VALUES ('$name','$file','$position',0,'$link',$beginTime,$finalTime)";
    $addAd_run = mysqli_query($connection, $addAdQuery);
    if ($addAd_run) {
        header("Location:" . $urlbase . "admin/ads");
    } else {
        echo "nao";
        setcookie("message", "Erro ao adicionar o Anúncio ", time() + (60), "/");
        header("Location:" . $urlbase . "admin/ads");
    }
}