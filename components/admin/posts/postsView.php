<?php

include(__DIR__ . "/editPostLogic.php");

class EditPostView
{


    public function index()
    {
        $id = $_COOKIE['postid'];
        $editor = new EditPostLogic();
        return $editor->index($id);
    }

    public function getImages()
    {
        $getContent = new EditPostLogic();
        return $getContent->getImages();
    }
}

$getContent = new EditPostView();
$content = $getContent->index();
$allImages = $getContent->getImages();


?>

<div class="flex justify-center items-start w-full overflow-y-hidden">
    <form id="post" novalidate action="../components/admin/editPost/form.php" method="POST"
        class="flex justify-between text-center flex px-5 w-full h-full pt-2">
        <div class="w-4/12 flex justify-start flex-col items-center gap-y-3 p-3 overflow-y-auto h-full">
            <?= !empty($_COOKIE['message']) ? $_COOKIE['message'] : "" ?>
            <input type="submit" class="px-6 py-2 bg-slate-400 rounded-md border-black mb-3 cursor-pointer"
                value="Salvar" />
            <div class="input-wrapper h-10 mb-1">
                <input type="text" name="title" id="title" value="<?= $content["title"] ?>"
                    class="bg-slate-300 px-2 outline-none rounded-md border border-black placeholder:text-black placeholder:text-opacity-30"
                    placeholder="nome do post" />
            </div>
            <div class="input-wrapper h-10 mb-1">
                <input type="datetime-local" name="datetime" id="datetime" value=<?= date("Y-m-d\TH:i", ($content['posted_at'])); ?>>
                <input type="hidden" id="datetime_text" value=<?= date("Y-m-d\TH:i", strtotime($content['posted_at'])); ?>>
            </div>
            <div class="input-wrapper h-10 mb-1">
                <select id="section" class="rounded-md border border-black mb-3" name="section">
                    <option <?php if ($content["section"] == 'n1') {
                        echo ("selected");
                    } ?>>n1</option>
                    <option <?php if ($content["section"] == 'n2') {
                        echo ("selected");
                    } ?>>n2</option>
                    <option <?php if ($content["section"] == 'n3') {
                        echo ("selected");
                    } ?>>n3</option>
                    <option <?php if ($content["section"] == 'n4') {
                        echo ("selected");
                    } ?>>n4</option>
                </select>
            </div>

            <input id="imageThumb" type="hidden" name="image" value=<?= $content["image"] ?> />
            <div id="image-holder"></div>
            <img src=<?= "./../images/" . $content["image"] ?> id="initialThumb" class="w-auto h-20" />
            <button type="button" id="openmodal" class=" text-white bg-black rounded-md p-2">Selecionar
                Foto</button>
            <div class="input-wrapper">
                <input type="text" name="summary" id="summary" value="<?= htmlspecialchars($content["summary"]) ?>" />
            </div>
        </div>
        <div class="input-wrapper w-8/12">
            <div class="h-full flex items-start justify-center">
                <textarea id="sample" class="input textarea h-full"></textarea>
            </div>
        </div>
    </form>
    <!-- begin modal Images-->
    <div id="modalimages"
        class="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-70">
        <div class="bg-white rounded shadow-lg w-2/3 h-2/3 overflow-y-auto p-2">
            <main class="w-full flex flex-col overflow-y-auto ">
                <div id="closemodal" class="w-full flex justify-end items-start mb-5 ">
                    <span class="text-3xl text-red-500 cursor-pointer">x</span>
                </div>
                <div class="flex flex-wrap mx-2 gap-3">
                    <?php
                    foreach ($allImages as $key => $values): ?>
                        <div class="cursor-pointer relative">
                            <img src=<?= "./../images/" . $values["name"] ?> alt=<?= $values["name"] ?> class="w-auto h-20" />
                        </div>
                    <?php endforeach; ?>
                </div>
            </main>
        </div>
    </div>
    <!-- end modal Images-->
</div>