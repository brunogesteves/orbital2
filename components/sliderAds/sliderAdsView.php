<?php

include(__DIR__ . "/sliderAdsLogic.php");

class SliderAdsView
{

  public function index()
  {
    $getContent = new SliderAdsLogic();
    return $getContent->index();
  }
}

$content = new SliderAdsView();
$allPosts = $content->index();

?>

<div class="w-3/4 h-full slider flex justify-center items-center cursor-pointer max-sm:hidden">
  <?php
  foreach ($allPosts as $key): ?>
    <a href=<?= $key["link"] ?> target="_blank" class="h-full w-full">
      <div class="flex justify-center items-center h-full w-full">
        <img src=<?= "./images/" . $key["file"] ?> class=" w-full h-full " />
      </div>
    </a>

  <?php endforeach; ?>
</div>