<?php
include(__DIR__ . "/../../../config.php");

$target_dir = __DIR__ . "/../../../images/";
$target_file = $target_dir . "logo.jpg";

if (move_uploaded_file($_FILES["logotype"]["tmp_name"], $target_file)) {
    header("Location:" . $urlbase . "admin");
} else {
    header("Location:" . $urlbase . "admin");
}

