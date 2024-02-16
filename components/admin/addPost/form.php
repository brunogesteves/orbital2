<?php

include(__DIR__ . "/../../../db.php");
include(__DIR__ . "/../../../config.php");

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
if (!$connection) {
    header("Location:" . $url . "admin/errorserver");
} else {

    // echo "title: ", $title, "<br />";
    // echo "link: ", $link, "<br />";
    // echo "image: ", $image, "<br />";
    // echo "summary: ", $summary, "<br />";
    // echo "section: ", $section, "<br />";
    // echo "source: ", $source, "<br />";
    // echo "slug: ", $slug, "<br />";
    // echo "posted_at: ", $posted_at, "<br />";
    $title = str_replace("'", '"', $title);
    $newTitle = preg_replace(array("/(á|à|ã|â|ä)/", "/(Á|À|Ã|Â|Ä)/", "/(é|è|ê|ë)/", "/(É|È|Ê|Ë)/", "/(í|ì|î|ï)/", "/(Í|Ì|Î|Ï)/", "/(ó|ò|õ|ô|ö)/", "/(Ó|Ò|Õ|Ô|Ö)/", "/(ú|ù|û|ü)/", "/(Ú|Ù|Û|Ü)/", "/(ñ)/", "/(Ñ)/", "/(ç|Ç)/", "/(1º)/", "/(2º)/", "/(3º)/", "/(4º)/", "/(5º)/", "/(6º)/", "/(7º)/", "/(8º)/", "/(9º)/"), explode(" ", "a A e E i I o O u U n N c C 1 2 3 4 5 6 7 8 9"), $title);
    $slug = str_replace(array(" ", ":", ";", "?", "/", '"', ',', '.'), "-", strtolower($newTitle));




    $addpostQuery = "INSERT INTO posts (title, link, image, summary, section, source, slug, status, posted_at)
                                 VALUES ('$title', '$link', '$image', '$summary', '$section',  '$source', '$slug', 0, '$posted_at')";
    $addpost_run = mysqli_query($connection, $addpostQuery);

    if ($addpost_run) {
        header("Location:" . $urlbase . "admin");
    } else {
        header("Location:" . $urlbase . "admin/adicionar");
        setcookie("message", "Erro ao adicionar o post " . htmlspecialchars(basename($target_file)), time() + (60), "/");
    }
}



