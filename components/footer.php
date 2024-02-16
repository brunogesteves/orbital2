<?php
include(__DIR__ . "/../config.php");
?>


<footer class="bg-black text-white flex flex-col justify-center items-center  py-3 z-50">
    <img src=<?= $urlbase . "images/logo.jpg" ?> alt="logo" class="rounded-full w-10" />

    <span> Orbital Channel - Direitos Reservados</span>
</footer>
<div class="fixed bottom-8 right-7 bg-slate-300 rounded-md p-2 z-50 cursor-pointer" id="scrollToUp">
    <img src=<?= $urlbase . "images/icons/up-arrow.svg" ?> alt="up" class="w-7 h-7 z-50" />
</div>

</body>
<script type="text/javascript">
    $(document).ready(function () {
        $('#scrollToUp').click(function () {
            // $(window).animate({ scrollTop: 0 }, '500');
            $(window).scrollTop(0);

        });
    });
</script>


</html>