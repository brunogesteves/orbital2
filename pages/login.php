<?php

include(__DIR__ . "/../../config.php");


if ($_COOKIE['userId'] != 0) {
    header("Location:" . $urlbase . "admin");
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="CACHE-CONTROL" content="NO-CACHE" />
    <meta http-equiv="PRAGMA" content="NO-CACHE" />

    <script type="text/javascript" src="./scripts/validate.js" defer></script>
    <script type="text/javascript" src="./scripts/jquery.js"></script>
    <script type="text/javascript" src="./scripts/validationLogin.js" defer></script>
    <script type="text/javascript" src="./scripts/tailwind.js"></script>

    <link rel="shortcut icon" href="./images/logo.ico" type="image/x-icon" />

    <title>Orbital Channel</title>
</head>

<body>
    <div class=" h-screen flex flex-col justify-evenly items-center h-auto gap-y-3 ">
        <div class="flex justify-center ">
            <img src="images/logo.jpg" alt="logo" />
        </div>
        <form method="post" id="async_form" autocomplete="off" novalidate="novalidate"
            action="components/admin/login/form.php" class="max-lg:hidden">
            <div class="control-wrapper ">
                <div class="input-wrapper">
                    <input id="email" class="input" autocomplete="off" type="email" name="email" placeholder="email"
                        value="email@email.com" />
                </div>
            </div>
            <div class="control-wrapper">
                <div class="input-wrapper">
                    <input id="password" class="input" autocomplete="off" type="password" name="password" placeholder="
                            senha" value="1234" />
                </div>
            </div>
            <div class="control-wrapper">
                <button type="submit"
                    class="cursor-pointer text-xl bg-black text-white w-20 text-center my-3 rounded-md">Entrar</button>
            </div>
            <?php


            echo getenv('MAIL_FROM_ADDRESS');


            ?>
            <div class="text-red-500">

                <?= empty($_COOKIE["message"]) ? "" : $_COOKIE["message"] ?>
            </div>
        </form>
    </div>
</body>

</html>