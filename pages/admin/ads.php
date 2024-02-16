<?php
include(__DIR__ . "/../../config.php");

if ($_COOKIE['userId'] == 0) {
    header("Location:" . $urlbase . "login");
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="CACHE-CONTROL" content="NO-CACHE" />
    <meta http-equiv="PRAGMA" content="NO-CACHE" />
    <meta http-equiv="refresh" content="<?php echo $pageRefresh; ?>" />


    <script src="./../scripts/tailwind.js"></script>
    <script src="./../scripts/jquery.js"></script>
    <script src="./../scripts/adsmodal.js"></script>
    <script src="./../scripts/timenow.js"></script>
    <script type="text/javascript" src="./../scripts/validate.js" defer></script>
    <script type="text/javascript" src="./../scripts/validationAds.js" defer></script>

    <link rel="shortcut icon" href="./../images/logo.ico" type="image/x-icon" />

    <title>Orbital Channel</title>
</head>

<body>

    <header class="flex justify-between items-center px-2 py-2">
        <?php
        include(__DIR__ . "/../../components/admin/logotype/logotypeView.php");
        ?>
        <div class="text-4xl timestamp"></div>
        <div class="flex flex-col items-center">
            <form method="POST" action="../components/admin/login/form.php">
                <input type="submit" value="Sair" name="submit_logout"
                    class="cursor-pointer text-xl bg-black text-white w-20 text-center mt-3 rounded-md" />
            </form>
        </div>
    </header>

    <main class="h-[calc(100vh_-_277px)] flex justify-start">
        <?php
        include(__DIR__ . "/../../components/admin/sidebar/sidebarView.php");
        ?>
        <?php
        include(__DIR__ . "/../../components/admin/ads/adsView.php");
        ?>
    </main>
    <?php
    include(__DIR__ . "/../../components/footer.php")
        ?>

</body>

</html>