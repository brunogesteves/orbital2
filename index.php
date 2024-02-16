<?php

class Router
{

  private $pages = ["", "login", "admin", "page404", "errorserver"];
  private $adminPages = ["procurar", "ads", "adicionar", "editar", "imagens", "errorserver"];


  public function run()
  {
    $folderPath = dirname($_SERVER["SCRIPT_NAME"]);
    $urlPath = $_SERVER["REQUEST_URI"];
    $url = explode("/", substr($urlPath, strlen($folderPath)));

    if (in_array($url[1], $this->pages, true)) {
      if ($url[1] === "") {
        include(__DIR__ . "/pages/home.php");

      } else if ($url[1] === "admin") {
        if (in_array($url[2], $this->adminPages, true)) {

          if ($url[2] === "procurar") {
            include(__DIR__ . "/pages/admin/search.php");
          } else if ($url[2] == "ads") {
            include(__DIR__ . "/pages/admin/ads.php");
          } else if ($url[2] == "adicionar") {
            include(__DIR__ . "/pages/admin/addpost.php");
          } else if ($url[2] == "editar") {
            include(__DIR__ . "/pages/admin/editpost.php");
          } else if ($url[2] == "imagens") {
            include(__DIR__ . "/pages/admin/images.php");
          } else if ($url[2] == "ads") {
            include(__DIR__ . "/pages/admin/ads.php");
          } else if ($url[2] == "errorserver") {
            include(__DIR__ . "/pages/admin/errorserver.php");
          }
        } else {
          include(__DIR__ . "/pages/admin/admin.php");
        }
      } else if ($url[1] === "login") {
        include(__DIR__ . "/pages/login.php");
      }
    } else if ($url[1] === "pagenotfound") {
      include(__DIR__ . "/pages/pagenotfound.php");
    } else if ($url[1] === "error") {
      include(__DIR__ . "/pages/error.php");

    } else {
      include(__DIR__ . "/pages/post.php");
    }
  }


}

$router = new Router();

$router->run();
