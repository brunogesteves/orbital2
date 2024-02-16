<?php
include(__DIR__ . "/../../../db.php");
include(__DIR__ . "/../../../config.php");
$email = $_POST['email'];
$password = $_POST['password'];
$db = new DB();
$connection = $db->hasDBconnection();
$getUserQuery = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$hasUser = mysqli_query($connection, $getUserQuery);
$user = $hasUser->fetch_assoc();
if ($hasUser->num_rows == 1) {
    setcookie("userId", $user["id"], time() + (86400 * 30), "/"); // 86400 = 1 day
    setcookie("message", "", time() + (60), "/");
    header("Location:" . $urlbase . "admin");
    exit;
} else {
    setcookie("message", "Email e/ou Senha inválidos", time() + (60), "/");
    header("Location:" . $urlbase . "login");

}
if (isset($_POST["logout"])) {
    setcookie("userId", 0, time() + (86400 * 30), "/"); // 86400 = 1 day
    setcookie("message", "", time() + (60), "/"); // 86400 = 1 day

    header("Location:" . $urlbase . "login");
}
?>