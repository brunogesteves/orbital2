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
    <script src="./scripts/postnews.js"></script>
    <script src="./scripts/textspeech.js"></script>
    <script type="text/javascript" src="./scripts/slider.js"></script>
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        }
    </script>
    <script type="text/javascript"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

    <link rel="stylesheet" href="./styles/slick-theme.css" />
    <link rel="stylesheet" href="./styles/slick.css" />
    <link rel="shortcut icon" href="images/logo.ico" type="image/x-icon" />
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <div id="fb-root"></div>
    <script async defer crossorigin="anonymous" src="https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v18.0"
        nonce="KMuC73mC"></script>


    <title>Orbital Channel</title>
</head>

<body>
    <?php
    include(__DIR__ . "/../components/top.php");
    ?>
    <hr class="h-1 bg-black mb-2  max-sm:hidden" />
    <main class="h-auto flex items-start mx-2 max-sm:flex-col ">
        <div class="w-1/6 flex justify-center items-start max-sm:w-full">ads</div>
        <div class="w-4/6 h-auto flex justify-center items-start max-sm:w-full">
            <?php include(__DIR__ . "/../components/post/postView.php"); ?>

        </div>
        <div class="w-1/6 flex justify-center items-start max-sm:w-full ">
            <?php include(__DIR__ . "/../components/post/morePostsView.php"); ?>

        </div>
    </main>
    <?php
    include(__DIR__ . "/../components/footer.php");
    ?>
</body>

</html>