<?php
include(__DIR__ . "/adsLogic.php");
class AdsView
{

    public function index()
    {
        $getContent = new AdsLogic();
        return $getContent->index();
    }

    public function getImages()
    {
        $getContent = new AdsLogic();
        return $getContent->getImages();
    }
}

$content = new AdsView();
$allAds = $content->index();
$allImages = $content->getImages();
// var_dump($allAds[0])
?>

<div class="w-full text-center">
    <div class="w-full">
        <button type="button" class="btnOpenAddNewPost text-white bg-black my-7 p-2 rounded-lg text-xl">Adicionar
            Anúncio</button>
    </div>
    <div class="h-[calc(100vh_-_377px)] overflow-y-auto w-full ">
        <?php
        foreach ($allAds as $key): ?>
            <div>
                <div class="h-36 flex justify-center">
                    <img src=<?= "./../images/" . $key["file"] ?> class="w-fill h-full" />
                </div>
                <div class="flex justify-between items-center h-auto w-full mb-20 px-3 py-2 gap-x-1">
                    <p class="w-14">
                        <?= $key["name"] ?>
                    </p>
                    <p class="w-5">
                        <?= $key["position"] ?>
                    </p>
                    <h2 class="w-3">
                        <?= $key["section"] ?>
                    </h2>
                    <h2 class="w-96 mx-2">
                        <?= $key["link"] ?>
                    </h2>
                    <h2 class="w-24">
                        <?= date("d/m/Y h:i:s A", $key["beginTime"]); ?>
                    </h2>
                    <h2 class="w-24">
                        <?= date("d/m/Y h:i:s A", $key["finalTime"]); ?>
                    </h2>
                    <h2 class="w-20 ">
                        <?= $key["status"] == 0 ? "Fora do Ar" : "Publicado" ?>
                    </h2>
                    <div class="flex gap-x-1">
                        <button class="btnOpenEditModal bg-black hover:bg-red-700 px-3 py-1 rounded text-white m-3">
                            Editar
                        </button>
                        <form method="POST" class="mt-4" action="../components/admin/ads/form.php">
                            <input type="hidden" name="id" value=<?= $key["id"] ?> />
                            <button type="submit" name="deleteAd" class=" rounded-md">
                                x
                            </button>
                        </form>
                    </div>
                </div>
                <!-- begin edit ad modal -->
                <div
                    class="modalEditAd h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-70">
                    <div class="bg-white rounded shadow-lg w-2/3 h-2/3 overflow-y-auto p-2">
                        <form method="post" id="formAd" action="../components/admin/ads/form.php">
                            <div class="flex justify-center w-full">
                                <button type="button"
                                    class="btnModalOpenImages text-white bg-black my-7 p-2 rounded-lg text-xl">Mudar
                                    Imagem</button>
                            </div>
                            <div class="h-36 flex justify-center">
                                <img src=<?= "./../images/" . $key["file"] ?> class="initialThumb w-fill h-full" />
                                <div class="image-holder"></div>
                                <input class="imageThumb" type="hidden" name="file" />
                            </div>
                            <div class="flex justify-around items-center gap-x-2 my-8 ">
                                <span>Título:
                                </span>

                                <div class="input-wrapper">
                                    <input type="text" name="name" id="name" value=<?= $key["name"] ?>
                                        class="bg-slate-300 w-44 px-2 outline-none rounded-md border border-black placeholder:text-black placeholder:text-opacity-30"
                                        placeholder="nome do anúncio" />
                                </div>
                                <div>
                                    <span>Posição:</span>
                                    <select name="position" class="h-10 rounded-md text-center bg-blue-600 text-white">
                                        <option value="news" <?php if ($key["position"] == 'news') {
                                            echo ("selected");
                                        } ?>>news</option>
                                        <option value="top" <?php if ($key["position"] == 'top') {
                                            echo ("selected");
                                        } ?>>top</option>
                                        <option value="mobile" <?php if ($key["position"] == 'mobile') {
                                            echo ("selected");
                                        } ?>>mobile</option>

                                    </select>
                                </div>
                                <div>
                                    <span>Status:</span>
                                    <?= $key["status"] == 0 ? "Fora do Ar" : "Publicado" ?>
                                </div>
                                <div class="input-wrapper">
                                    <input type="text" name="link" id="link" value=<?= $key["link"] ?>
                                        class="bg-slate-300 px-2 outline-none rounded-md border border-black placeholder:text-black placeholder:text-opacity-30"
                                        placeholder="endereço do link" />
                                </div>
                            </div>
                            <div class="flex justify-around border-y-2 border-black py-2 mb-3">
                                <div class="input-wrapper">
                                    <span>Início:</span>
                                    <input type="datetime-local" name="beginTime" id="beginEditTime"
                                        value=<?= date("Y-m-d\TH:i", ($key['beginTime'])); ?>>
                                    <input type="hidden" id="beginTime_text" value=<?= date("Y-m-d\TH:i:s", strtotime($key['beginTime'])); ?>>
                                </div>
                                <div class="input-wrapper">
                                    <span>Fim:</span>
                                    <input type="datetime-local" name="finalTime" id="finalTime" value=<?= date("Y-m-d\TH:i", ($key['finalTime'])); ?>>
                                    <input type="hidden" id="finalTime_text" value=<?= date("Y-m-d\TH:i:s", strtotime($key['finalTime'])); ?>>
                                </div>
                            </div>
                            <input type="hidden" name="id" value="<?= $key["id"] ?>" />

                            <input type="hidden" name="status" value="<?= $key["status"] ?>" />
                            <div class="flex justify-end items-start w-100 p-3 gap-x-3 h-14">
                                <button type="button"
                                    class="btnCloseEditModal bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white mr-1">
                                    Cancelar
                                </button>
                                <input type="submit"
                                    class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white cursor-pointer"
                                    name="updateAd" value="Salvar" />
                                <input type="submit"
                                    class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white cursor-pointer"
                                    name="publishAd" value=<?= $key["status"] == 0 ? "Publicar" : "Despublicar" ?> />
                        </form>
                        </form>
                    </div>
                </div>
                <!-- end edit ad modal -->
            </div>
        <?php endforeach; ?>
    </div>

    <!-- begin new ad modal -->
    <div class="modalAddAd h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-10">
        <div class="bg-white rounded shadow-lg w-2/3 h-2/3 overflow-y-auto p-2">
            <form method="post" id="formAddAds" action="../components/admin/ads/form.php">
                <div class="flex justify-center w-full">
                    <button type="button"
                        class="btnModalOpenImages text-white bg-black my-7 p-2 rounded-lg text-xl">adicionar
                        Imagem</button>
                </div>
                <div class="h-36 flex justify-center">
                    <img src="./../images/logo.jpg" class="initialThumb w-fill h-full" />
                    <div class="image-holder"></div>
                    <input class="imageThumb" type="hidden" name="file" />
                </div>
                <div class="flex justify-around items-center gap-x-2 my-8 ">
                    <span>Título:</span>
                    <div class="input-wrapper">
                        <input type="text" name="name" id="name"
                            class="bg-slate-300 w-44 px-2 outline-none rounded-md border border-black placeholder:text-black placeholder:text-opacity-30"
                            placeholder="nome do post" />
                    </div>
                    <div class="input-wrapper">
                        <span>Posição:</span>
                        <select name="position" class="h-10 rounded-md text-center bg-blue-600 text-white">
                            <option value="news">news</option>
                            <option value="top">top</option>
                            <option value="slide">mobile</option>
                        </select>
                    </div>
                    <div class="input-wrapper">
                        <input type="text" name="link" id="link"
                            class="bg-slate-300 px-2 outline-none rounded-md border border-black placeholder:text-black placeholder:text-opacity-30"
                            placeholder="endereço do link" />
                    </div>
                </div>
                <div class="flex justify-around border-y-2 border-black py-2 mb-3">
                    <div class="input-wrapper">
                        <span>Início:</span>
                        <input type="datetime-local" name="beginTime" id="beginTime">
                    </div>
                    <div class="input-wrapper">
                        <span>Fim:</span>
                        <input type="datetime-local" name="finalTime" id="finalTime">
                    </div>
                </div>

                <div class="flex justify-end items-start w-100 p-3 gap-x-3 h-14">
                    <button type="button"
                        class="btnCloseAdModal bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white mr-1">
                        Cancelar
                    </button>
                    <input type="submit"
                        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white cursor-pointer" name="saveAd"
                        value="Salvar" />
                </div>
            </form>
        </div>
    </div>
    <!-- end new modal -->
    <!-- begin modal Images-->
    <div class="modalImages h-screen w-full fixed left-0 top-0 flex justify-center items-center">
        <div class="bg-white rounded shadow-lg w-2/3 h-2/3 overflow-y-auto p-2">
            <main class="w-full flex flex-col overflow-y-auto ">
                <div class="w-full flex justify-end items-start mb-5">
                    <span class="btnCloseModalImages text-3xl text-red-500 cursor-pointer">x</span>
                </div>
                <div class="flex flex-wrap mx-2 gap-3">
                    <?php
                    foreach ($allImages as $key => $values): ?>
                        <div class="cursor-pointer relative ">
                            <img src=<?= "./../images/" . $values["name"] ?> alt=<?= $values["name"] ?>
                                class="h-20 w-20 object-scale-down" />
                        </div>
                    <?php endforeach; ?>
                </div>
            </main>
        </div>
    </div>
    <!-- end modal Images-->
</div>