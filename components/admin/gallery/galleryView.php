<?php
include(__DIR__ . "/galleryLogic.php");
class GalleryView
{

    public function index()
    {
        $getContent = new GalleryLogic();
        return $getContent->index();
    }
}

$getContent = new GalleryView();
$content = $getContent->index();
?>

<main class="w-full flex flex-col overflow-y-auto ">
    <div class="w-full flex justify-center items-start gap-x-5">
        <form method="post" enctype="multipart/form-data" class="flex flex-col"
            action="../components/admin/gallery/form.php">
            <input type="file" name="file" id="fileUpload" required accept=".jpg, .jpeg, .png" />
            <button type="submit" name="addImage"
                class="text-white bg-black my-7 p-2 rounded-lg text-xl">adicionar</button>
            <span>
                <?= $_COOKIE["message"] ?>
            </span>
        </form>
        <div id="image-holder"></div>
    </div>
    <div class="flex items-center flex-wrap mx-2 gap-3">
        <?php
        foreach ($content as $key => $values): ?>
            <div class="cursor-pointer relative w-28 h-auto">
                <form method="post" action="../components/admin/gallery/form.php">
                    <input type="hidden" required name="imageId" value=<?= $values["id"] ?> />
                    <button type="submit" name="deleteImage"
                        class="text-red-500 text-3xl absolute top-1 right-3 ">x</button>
                </form>
                <img src=<?= "./../images/" . $values["name"] ?> alt=<?= $values["name"] ?> class="w-fill" />
            </div>
        <?php endforeach; ?>
    </div>
</main>