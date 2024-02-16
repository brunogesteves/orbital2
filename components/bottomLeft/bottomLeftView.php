<?php
include(__DIR__ . "/bottomLeftLogic.php");
class BottomLeftView
{

    public function index()
    {
        $getContent = new BottomLeftLogic();
        return $getContent->index();
    }
}

$content = new BottomLeftView();
$allPosts = $content->index();
?>

<div class="h-full flex flex-col justify-between items-around max-sm:flex-col max-sm:pl-1 mr-2 gap-3">
    <?php
    foreach ($allPosts as $key): ?>
        <a href=<?= $key["slug"] ?>>
            <span class="border-l-4 border-red-500 pl-2 cursor-pointer text-xl">
                <?= $key["title"] ?>
            </span>
        </a>
    <?php endforeach; ?>
</div>