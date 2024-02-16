<?php
include(__DIR__ . "/../../../db.php");
include(__DIR__ . "/../../../config.php");

if (isset($_POST["addImage"])) {
    $image = $_FILES["file"]["name"];
    $splitNameFile = pathinfo($image);

    $db = new DB();
    $connection = $db->hasDBconnection();
    if (!$connection) {
        header("Location:" . $urlbase . "admin/errorserver");
    } else {

        $target_dir = __DIR__ . "/../../../images/";
        $target_file = $target_dir . basename($_FILES["image"]["name"]);

        if (file_exists($target_file)) {
            $image = $splitNameFile["filename"] . "(1)." . $splitNameFile["extension"];
            $target_file = $target_dir . basename($image);
        }


        $addImageQuery = "INSERT INTO images (name) VALUES ('$image')";
        $result = mysqli_query($connection, $addImageQuery);

        if ($result) {
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
                header("Location:" . $urlbase . "admin/imagens");
                setcookie("message", "Image Adicionada.", time() + (60), "/");

            } else {
                header("Location:" . $urlbase . "admin/imagens");
                setcookie("message", "Imagem não adicionada", time() + (60), "/");

            }
        }
    }
}
if (isset($_POST["deleteImage"])) {
    $id = $_POST["imageId"];

    $db = new DB();
    $connection = $db->hasDBconnection();
    if (!$connection) {
        header("Location:" . $urlbase . "admin/errorserver");
    } else {
        $deleteQuery = "DELETE from images WHERE id = $id";
        $result = mysqli_query($connection, $deleteQuery);
        if ($result) {
            header("Location:" . $urlbase . "admin/imagens");
        }
    }
}






