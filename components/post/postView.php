<?php

include(__DIR__ . "/postLogic.php");
class PostView
{

    public function index()
    {
        $folderPath = dirname($_SERVER["SCRIPT_NAME"]);
        $urlPath = $_SERVER["REQUEST_URI"];
        $slug = explode("/", substr($urlPath, strlen($folderPath)))[1];
        $getPostContent = new PostLogic();
        return $getPostContent->index($slug);
    }
}
$getContent = new PostView();
$content = $getContent->index();


?>

<div class="h-auto text-center w-full flex flex-col justify-center">
    <div id="excerpt">
        <h1 class="w-full text-center text-3xl font-bold mb-2 max-sm:px-0">
            <?= $content["title"] ?>
        </h1>
        <div class="flex justify-center">
            <img src=<?= $content["source"] == "Orbital Channel" ? "./images/" . $content["image"] : $content["image"] ?>
                alt="<?= $content["image"] ?>" class="w-96 h-auto self-center" />
        </div>
        <!-- begin share -->
        <div class="flex gap-y-7 justify-start items-center gap-x-7 p-2 rounded-md max-sm:justify-center max-sm:my-5">
            <div class="fb-share-button" data-href="https://developers.facebook.com/docs/plugins/" data-layout=""
                data-size="">
                <a target="_blank"
                    href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
                    class="fb-xfbml-parse-ignore">

                </a>
            </div>
            <a href="https://orbitaltv.net/<?= $content["slug"] ?>" class="twitter-share-button"
                data-show-count="false">
                <img src="./images/x.jpg" class="h-5 w-5" />
            </a>

            <a href="https://api.whatsapp.com/send?text=https://orbitaltv.net/<?= $content["slug"] ?>" target="_blank">
                <img src="./images/whats.png" class="h-5 w-5" />
            </a>
        </div>
        <!-- end share -->
        <!-- begin speechtotext -->
        <div id="speechtotext" class="mt-2">
            <button type="button" id="pause" class="cursor-pointer bg-black text-white p-3">
                Pausar
            </button>
            <button type="button" id="resume" class="cursor-pointer bg-black text-white p-3">
                Retomar
            </button>
            <button type="button" id="stop" class="cursor-pointer bg-black text-white p-3">
                Parar
            </button>
            <input type="submit" id="play" value="Escutar matéria" class="cursor-pointer bg-black text-white p-3" />
        </div>
        <!-- end speechtotext -->

        <div class="mt-3">
            <span id="msg" class="text-justify mt-3 mb-7 max-sm:px-2 mt-3">
                <?= substr($content["summary"], 0, 250); ?>...
            </span>
        </div>
        <div class="flex flex-col w-full  max-sm:justify-center mb-3  items-center">
            <p class="text-start my-4 font-bold max-sm:pl-2">Fonte:
                <?= $content["source"] ?>
            </p>
            <button class="bg-black text-white p-3 w-52 rounded-md" id="button_change">
                Ler matéria completa
            </button>
        </div>
    </div>
    <div class="w-full h-full p-3" id="complete">
        <iframe src=<?= $content["link"] ?> height="100vh" title="description"
            style="overflow:hidden;height:100vh;width:100%"></iframe>
    </div>
</div>