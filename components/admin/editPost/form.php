<?php

include(__DIR__ . "/../../../db.php");
include(__DIR__ . "/../../../config.php");


$id = $_COOKIE["postid"];
$title = $_POST["title"];
$link = "";
$image = $_POST["image"] ?? "logo.png";
$summary = $_POST["summary"];
$section = $_POST["section"];
$source = "Orbital Channel";
$posted_at = strtotime($_POST["datetime"]);



$title = str_replace("'", '"', $title);
$title = preg_replace(array("/(á|à|ã|â|ä)/", "/(Á|À|Ã|Â|Ä)/", "/(é|è|ê|ë)/", "/(É|È|Ê|Ë)/", "/(í|ì|î|ï)/", "/(Í|Ì|Î|Ï)/", "/(ó|ò|õ|ô|ö)/", "/(Ó|Ò|Õ|Ô|Ö)/", "/(ú|ù|û|ü)/", "/(Ú|Ù|Û|Ü)/", "/(ñ)/", "/(Ñ)/", "/(ç|Ç)/", "/(1º)/", "/(2º)/", "/(3º)/", "/(4º)/", "/(5º)/", "/(6º)/", "/(7º)/", "/(8º)/", "/(9º)/"), explode(" ", "a A e E i I o O u U n N c C 1 2 3 4 5 6 7 8 9"), $title);
$slug = str_replace(array(" ", ":", ";", "?", "/", '"', ',', '.'), "-", strtolower($title));
$summary = preg_replace(array("/(')/", "/(‘)/"), explode(" ", "\' \‘"), $summary);

$summary = str_replace('./../', "$urlbase", $summary);

$db = new DB();
$connection = $db->hasDBconnection();

$updatePostQuery = "UPDATE posts SET 
    title = '$title', link = '$link',
     image ='$image', 
     summary = '$summary',
      section = '$section',
      source = '$source',
        slug = '$slug',         
          posted_at = '$posted_at' WHERE id = $id";
$updatePost_run = mysqli_query($connection, $updatePostQuery);

if ($updatePost_run) {
    header("Location:" . $urlbase . "admin/editar");
    setcookie("message", "Post Atualizado.", time() + (60), "/");
} else {
    header("Location:" . $urlbase . "errorserver");
    setcookie("message", "Erro ao atualizar o post.", time() + (60), "/");

}
