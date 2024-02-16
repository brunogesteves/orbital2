<?php
include(__DIR__ . "/../../../db.php");
include(__DIR__ . "/../../../config.php");
if (isset($_POST["updatePost"])) {
    $id = $_POST["id"];
    $section = $_POST["section"];

    if ($_POST["source"] == "Orbital Channel") {
        setcookie("postid", $id, time() + (86400), "/"); // 86400 = 1 day

        header("Location:" . $urlbase . "admin/editar");
    } else {
        $db = new DB();
        $connection = $db->hasDBconnection();
        $updateQuery = "UPDATE posts SET section = '$section' WHERE id = $id";
        $result = mysqli_query($connection, $updateQuery);
        if ($result) {
            header("Location:" . $urlbase . "admin");
        }

    }


    // echo "id: ", $_POST["id"], "<br />";
// echo "status: ", $_POST["status"], "<br />";
// echo "section: ", $_POST["section"], "<br />";
// echo "source: ", $_POST["source"], "<br />";
}
if (isset($_POST["publishPost"])) {
    $id = $_POST["id"];
    $status = $_POST["status"] == 0 ? 1 : 0;
    print_r($_POST);

    $db = new DB();
    $connection = $db->hasDBconnection();
    if (!$connection) {
        header("Location:" . $urlbase . "errorserver");
    } else {

        $updateQuery = "UPDATE posts SET status = '$status' WHERE id = $id";
        $result = mysqli_query($connection, $updateQuery);

        if ($result) {
            header("Location:" . $urlbase . "admin");
        }

    }
}
if (isset($_POST["delete_post"])) {
    $id = $_POST["id"];
    $db = new DB();
    $connection = $db->hasDBconnection();
    if (!$connection) {
        header("Location:" . $urlbase . "errorserver");
    } else {
        $deletepostQuery = "DELETE FROM posts WHERE id = '$id'";
        $deletepost_run = mysqli_query($connection, $deletepostQuery);
        header("Location:" . $urlbase . "admin");

    }
}
;
