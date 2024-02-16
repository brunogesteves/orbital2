<?php

include(__DIR__ . "/sliderAdsLogicMobile.php");

class SliderAdsViewMobile
{

  public function index()
  {
    $getAds = new SliderAdsLogicMobile();
    return $getAds->index();
  }
}

$ads = new SliderAdsViewMobile();
$allAds = $ads->index();
?>

<div class="h-auto slider w-full bg-black">
  <?php
  foreach ($allAds as $key): ?>
    <div class="bg-black">

      <a href=<?= $key["link"] ?> target="_blank" class="w-full">
        <img src=<?= "./images/" . $key["file"] ?> alt="link" class="w-full object-fill" />

      </a>
    </div>
  <?php endforeach; ?>
</div>