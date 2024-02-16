<?php
include(__DIR__ . "/thirdPartySource.php");
include(__DIR__ . "/translation.php");
class SearchLogic
{


  private function callSearch($term, $lang)
  {

    $articles = array();
    $callSearch = new SearchThirdPartySourceaApi();
    $getResults = $callSearch->index($term, $lang);
    foreach ($getResults as $values) {
      array_push($articles, $values);
    }

    return $articles;
  }

  // private function textToTranslation($searchTerm, $language)
  // {
  //   $textToTranslation = new Translation();
  //   return $textToTranslation->index($searchTerm, $language);
  // }
  public function index($term, $lang)
  {

    $res = self::callSearch($term, $lang);
    foreach ($res as $key) {
      // $key->title = $key->language !== "pt" ? self::textToTranslation($key->title, $key->language) : $key->title;
      // $key->summary = $key->language !== "pt" ? self::textToTranslation($key->summary, $key->language) : $key->summary;
    }

    return $res;
  }

}