<?php
include(__DIR__ . "/slideNewsLogic.php");
class SlideNewsView
{

    public function index()
    {
        $getSlideContent = new SlideNewsLogic();
        return $getSlideContent->index();
    }

}


$slideContent = new SlideNewsView();
$allPosts = $slideContent->index();


?>
<div class="w-1/2 max-sm:w-full flex flex-col">
    <div class="sliderArea h-96 max-sm:h-60 relative bg-blue-500 cursor-pointer">
        <div
            class="previewImg hidden max-sm:invisible bg-slate-500 hover:bg-slate-300 z-10 absolute top-1/2 left-0 rounded-l-md cursor-pointer p-3 rotate-180">
            <img src="images/icons/arrow-right.png" width="20" />
        </div>
        <div
            class="nextImg hidden max-sm:invisible bg-slate-500 hover:bg-slate-300 z-10 absolute top-1/2 right-0 rounded-l-md cursor-pointer p-3 rotate-0">
            <img src="./images/icons/arrow-right.png" width="20" class="" />
        </div>
        <div class="slider text-center text-white w-full">
            <?php
            foreach ($allPosts as $key): ?>
                <a href=<?= $key["slug"] ?> class="z-10">
                    <div class="bg-black w-full relative">
                        <img src=<?= $key["source"] == "Orbital Channel" ? "./images/" . $key["image"] : $key["image"] ?>
                            alt="" class="w-full h-96 opacity-70 max-sm:h-60 object-scale-down" />
                        <div class="absolute bottom-3 px-10 left-0 text-lg text-white w-full">
                            <span>
                                <?= substr($key["title"], 0, 40); ?>...
                            </span>
                        </div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

</div>