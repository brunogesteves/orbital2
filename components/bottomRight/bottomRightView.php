<?php
include(__DIR__ . "/bottomRightLogic.php");
class bottomRightView
{

    public function index()
    {
        $getContent = new bottomRightLogic();
        return $getContent->index();
    }
}

$content = new bottomRightView();
$allPosts = $content->index();
?>


<div class="w-full h-auto flex flex-wrap justify-between bg-slate-500 px-2 gap-3 max-sm:flex-col">
    <?php
    foreach ($allPosts as $key): ?>
        <a href=<?= $key["slug"] ?> class="max-sm:h-auto w-[30%]  max-sm:w-full">
            <div class="text-black text-center flex flex-col items-center max-sm:w-full max-sm:flex-row">
                <img src="<?= $key["source"] == "Orbital Channel" ? "./images/" . $key["image"] : $key["image"] ?>" alt=""
                    class="w-full object-scale-down max-sm:w-2/5 h-44 max-sm:h-[100px]" />
                <div class="max-sm:h-full w-full max-sm:w-3/5 pt-2 max-sm:pt-0">
                    <span
                        class="h-full w-full max-sm:pl-2 text-white font-bold max-sm:font-semibold text-xl flex items-center text-left">
                        <?= substr($key["title"], 0, 50); ?>...
                    </span>
                </div>
            </div>
        </a>
    <?php endforeach; ?>


</div>