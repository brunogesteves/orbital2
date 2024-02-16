<?php
include(__DIR__ . "/topLeftLogic.php");
class TopLeftView
{

    public function index()
    {
        $getContent = new TopLeftLogic();
        return $getContent->index();
    }
}

$content = new TopLeftView();
$allPosts = $content->index();

?>


<div
    class="w-1/2 h-96 flex justify-between items-start flex-wrap max-sm:h-auto max-sm:w-full max-sm:flex-nowrap max-sm:flex-col max-md:mb-2 max-sm:gap-y-2 ">
    <?php
    foreach ($allPosts as $key): ?>
        <a href=<?= $key["slug"] ?>
            class="w-[48%] h-[50%] mb-2 flex flex-col justify-start items-start max-sm:w-full max-sm:h-[100px] max-sm:flex-row">
            <img src="<?= $key["image"] ?>" alt=""
                class="h-3/4 w-full object-contain max-sm:object-scale-down max-sm:w-2/5 max-sm:h-full" />
            <div class=" max-sm:h-auto w-full max-sm:w-3/5 ">
                <span
                    class=" w-full max-sm:px-2 text-black  text-xl max-sm:py-0 max-sm:text-black flex items-start text-left">
                    <?= substr($key["title"], 0, 40); ?>...
                </span>
            </div>

        </a>
    <?php endforeach; ?>
</div>