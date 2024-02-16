<?php
include(__DIR__ . "/../../../config.php");
?>


<div class="flex flex-col items-center justify-center">
    <img src=<?= $urlbase . "./images/logo.jpg" ?> alt="logo" class="w-24 h-24 h-auto text-center" />

    <form action="components/admin/logotype/form.php" method="POST" enctype="multipart/form-data"
        class="mt-1 flex flex-col gap-y-3">
        <input required type="file" name="logotype" class="my-2 flex self-center" accept=".jpg, .jpeg, .png" />
        <input type="submit" value="Modificar logo"
            class="bg-black py-2 text-white rounded-md cursor-pointer hover:bg-slate-300 hover:text-black" />
    </form>
</div>
</div>