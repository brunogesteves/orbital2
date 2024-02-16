<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="CACHE-CONTROL" content="NO-CACHE" />
    <meta http-equiv="PRAGMA" content="NO-CACHE" />

    <script src="./scripts/jquery.js"></script>
    <script src="./scripts/tailwind.js"></script>
    <script src="./scripts/slick.js"></script>
    <script src="./scripts/mobile.js"></script>
    <script type="text/javascript" src="./scripts/slider.js"></script>
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({ pageLanguage: 'pt' }, 'google_translate_element');
        }
    </script>
    <script type="text/javascript"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

    <link rel="stylesheet" href="./styles/slick-theme.css" />
    <link rel="stylesheet" href="./styles/slick.css" />
    <link rel="shortcut icon" href="./images/logo.ico" type="image/x-icon" />


    <title>Orbital Channel</title>
</head>

<body class="m-0 p-0 ">
    <div class="flex justify-center items-center flex-col">
        <div class="scrollable m-3 max-sm:m-0 ">
            <?php
            include(__DIR__ . "/../components/top.php");
            ?>
        </div>
        <main class="scrollable h-auto max-sm:mx-0 mx-3 ">
            <hr class="h-1 bg-black max-sm:hidden" />
            <section class="w-full h-auto gap-x-3 flex justify-between py-3 max-md:flex-col max-sm:-mt-14">
                <?php
                include(__DIR__ . "/../components/topLeft/topLeftView.php");
                include(__DIR__ . "/../components/slideNews/slideNewsView.php");
                ?>
            </section>
            <section class="flex justify-between w-full mt-5 h-auto mt-3 max-sm:flex-col">
                <div class="w-5/12 max-sm:w-full">
                    <?php
                    include(__DIR__ . "/../components/bottomLeft/bottomLeftView.php");
                    ?>
                </div>
                <div class="w-7/12  max-sm:w-full">
                    <?php
                    include(__DIR__ . "/../components/bottomRight/bottomRightView.php");
                    ?>
                </div>
            </section>
        </main>
    </div>

    <?php
    include(__DIR__ . "/../components/footer.php");
    ?>

</body>

</html>