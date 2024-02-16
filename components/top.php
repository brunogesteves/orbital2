<?php
include(__DIR__ . "/../config.php");
?>
<!-- <div id="google_translate_element" class="w-full"></div> -->
<header class="flex justify-center items-center h-[150px] py-3 gap-3 max-sm:hidden">
    <div class="w-1/4 flex justify-center h-full">
        <a href=<?= $urlbase ?>><img src="images/logo.jpg" alt="logo" class="h-full" /></a>
    </div>
    <?php include(__DIR__ . "/sliderAds/sliderAdsView.php"); ?>
</header>

<div class="hidden max-sm:flex max-sm:flex-col">
    <?php include(__DIR__ . "/sliderAds/sliderAdsViewMobile.php"); ?>
    <nav class=" bg-[#251014] w-full relative -mt-2">
        <div class="w-1/4 flex justify-start py-3 pl-3 gap-x-3 items-center">
            <img src="./images/icons/menu.svg" alt="logo" class="rounded-full w-7 h-7" id="menu_open" />
            <img src="./images/icons/close.png" alt="logo" class="rounded-full w-7 h-7 hidden" id="menu_close" />

            <a href=<?= $urlbase ?>><img src="./images/logo.jpg" alt="logo"
                    class="rounded-full w-12 h-12 object-scale-down" /></a>
        </div>
        <ul class="absolute top-16 bg-white h-auto w-1/2 px-2 z-50 transition duration-150 ease-out -translate-x-64">
            <li class="py-3">
                <a href="#" class="p-3 text-xl lowercase">HOME</a>
            </li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
            <li><a href="#">li</a></li>
        </ul>
    </nav>
</div>