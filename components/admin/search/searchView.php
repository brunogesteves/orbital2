<?php
include(__DIR__ . "/../../../images");
include(__DIR__ . "/languages.php");
include(__DIR__ . "/../../../db.php");

if (isset($_POST["search"])) {
    $searchTerm = $_POST["searchTerm"];
    $language = $_POST["language"];
    include(__DIR__ . "/searchLogic.php");
    $getContent = new SearchLogic();
    $allPosts = $getContent->index($searchTerm, $language);

}

$isNullAllPosts = is_null($allPosts);
?>
<div class="flex justify-start items-center w-full flex-col h-full">
    <div class="mt-3 w-full">
        <form method="POST" class=" w-full h-20 flex justify-center
            items-center gap-x-3">
            <input type="text" required name="searchTerm" class="bg-slate-300 rounded-md pl-2 outline-none"
                placeholder="buscar" />
            <select class="h-5" name="language" required>
                <option value="pt">Português</option>
                <?php
                foreach ($countries as $key => $values): ?>
                    <option value=<?= $values ?>><?= $key ?></option>
                <?php endforeach; ?>
            </select>
            <button type="submit" name="search"
                class="bg-slate-600 hover:bg-slate-700 px-3 py-1 rounded text-white m-5 cursor-pointer">Pesquisar
            </button>
        </form>
    </div>
    <div class=" h-auto overflow-y-auto w-full ">
        <div class="w-full text-center">
            <span>
                <?php if ($isNullAllPosts) {
                    echo "Buscar Notícias";
                } else if (sizeof($allPosts) == 0) {
                    echo "Sem Resultados";
                } ?>
            </span>
        </div>

        <?php
        foreach ($allPosts as $key => $values): ?>
            <div class="flex justify-between items-center h-auto gap-x-3 p-3">
                <img src="<?= $values->media ?>" class="w-28 h-auto object-scale-down" />
                <h2>
                    <?= $values->title ?>
                </h2>
                <div class="flex gap-x-5">
                    <button class="openmodal bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white m-5">
                        Verificar
                    </button>
                </div>
            </div>
            <!-- modal -->
            <div
                class="modalpost h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-50">
                <div class="bg-white rounded shadow-lg w-2/3 h-2/3 overflow-y-auto">
                    <div class="flex justify-start items-center gap-x-3 border-b px-4 py-2">
                        <div>
                            <p>Imagem:</p>
                            <img src="<?= $values->media ?>" alt="<?= $values->media ?>"
                                class="w-28 h-auto object-scale-down" />
                        </div>
                        <div class="text-black">Titulo:
                            <?= $values->title ?>
                        </div>
                    </div>
                    <div class="p-3 text-black">

                        <p>Texto:</p>
                        <span>
                            <?= $values->summary ?>
                        </span>
                        <p>Fonte:</p>
                        <p>
                            <?= $values->rights ?>
                        </p>
                        <form method="POST" action="../components/admin/search/form.php">
                            <div class="flex justify-end items-start w-100 border-t p-3 gap-x-3">
                                <button type="button"
                                    class="closemodal bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white mr-1">
                                    Cancelar
                                </button>
                                <input type="hidden" name="title" value="<?= $values->title ?>" />
                                <input type="hidden" name="link" value="<?= $values->link ?>" />
                                <input type="hidden" name="image" value="<?= $values->media ?>" />
                                <input type="hidden" name="summary" value="<?= $values->summary ?>" />
                                <input type="hidden" name="source" value="<?= $values->rights ?>" />
                                <select name="section" class="bg-blue-600 h-8 rounded-md text-center text-white">
                                    <option value="n1" selected="seletected">n1</option>
                                    <option value="n2">n2</option>
                                    <option value="n3">n3</option>
                                    <option value="n4">n4</option>
                                </select>
                                <input required type="datetime-local" name="date" id="datetime" />
                                <input type="submit" name="add" value="Adicionar"
                                    class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white cursor-pointer" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        <?php endforeach; ?>
    </div>