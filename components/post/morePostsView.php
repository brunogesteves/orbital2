<?php
include(__DIR__ . "/morePostsLogic.php");
class MorePostsView
{

  public function index()
  {
    $getContent = new MorePostsLogic();
    return $getContent->index();
  }
}

$content = new MorePostsView();
$allPosts = $content->index();


?>

<div class="min-h-screen flex flex-col items-center">
  <span class="font-bold text-center text-xl mt-4 mb-2">Mais Posts</span>
  <?php
  foreach ($allPosts as $row): ?>
    <a href=<?= $row["slug"] ?>>
      <img src=<?= $row["source"] == "Orbital Channel" ? "./images/" . $row["image"] : $row["image"] ?>
        class="h-36 w-full object-contain" />
      <div class="text-center mt-1 mb-3">
        <span class="pl-2 cursor-pointer">
          <?= $row["title"] ?>
        </span>
      </div>
    </a>
  <?php endforeach; ?>
</div>