<?php
include(__DIR__ . "/../gallery/galleryLogic.php");



class GalleryView
{

    public function index()
    {
        $getContent = new GalleryLogic();
        return $getContent->index();
    }
}

$getImages = new GalleryView();
$allImages = $getImages->index();

?>

<div class=" flex justify-center items-start w-full overflow-y-hidden">
    <form id="post" novalidate action="../components/admin/addPost/form.php" method="post"
        class="flex justify-between text-center flex px-5 w-full h-full pt-2">
        <div class="w-4/12 flex justify-start flex-col items-center gap-y-3 p-3 overflow-y-auto h-full">
            <input type="submit" class="px-6 py-2 bg-slate-400 rounded-md border-black mb-3 cursor-pointer"
                value="Salvar" />

            <div class="input-wrapper h-10 mb-1">
                <input required type="text" name="title" id="title"
                    class="bg-slate-300 px-2 outline-none rounded-md border border-black placeholder:text-black placeholder:text-opacity-30"
                    placeholder="nome do post" />
            </div>
            <div class="input-wrapper h-10 mb-1">

                <input type="datetime-local" name="datetime" id="datetime">

            </div>
            <div class="input-wrapper h-10 mb-1">
                <select id="section" class="rounded-md border border-black mb-3" name="section">
                    <option value="n1">n1</option>
                    <option value="n2">n2</option>
                    <option value="n3">n3</option>
                    <option value="n4">n4</option>
                </select>
            </div>
            <input id="imageThumb" type="hidden" name="image" />
            <div id="image-holder"></div>
            <button type="button" id="openmodal" class=" text-white bg-black rounded-md p-2">Selecionar
                Foto</button>
            <div class="input-wrapper">
                <input type="hidden" name="summary" id="summary">
            </div>
        </div>
        <div class=" input-wrapper w-8/12">
            <div class="h-full flex items-start justify-center">
                <textarea id="sample" class="input textarea h-full z-0"></textarea>
            </div>
        </div>
    </form>
    <!-- begin modal images -->
    <div id="modalpost"
        class="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-70">
        <div class="bg-white rounded shadow-lg w-2/3 h-2/3 overflow-y-auto p-2">
            <main class="w-full flex flex-col overflow-y-auto ">
                <div id="closemodal" class="w-full flex justify-end items-start mb-5 ">
                    <span class="text-3xl text-red-500 cursor-pointer">x</span>
                </div>
                <div class="flex flex-wrap mx-2 gap-3">
                    <?php
                    foreach ($allImages as $key => $values): ?>
                        <div class="cursor-pointer relative w-10 h-10">
                            <img name="filename" src=<?= "./../images/" . $values["name"] ?> alt=<?= $values["name"] ?>
                                class="w-fill" />
                        </div>
                    <?php endforeach; ?>
                </div>
            </main>
        </div>
    </div>
    <!-- end modal images -->
</div>