<?php
include(__DIR__ . "/../config.php");
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script src="./scripts/tailwind.js"></script>


  <link rel="shortcut icon" href="./images/logo.ico" type="image/x-icon" />

  <title>Orbital Channel</title>
</head>

<body>
  <main class="h-[calc(100vh_-_88px)] flex justify-center items-center ">
    <section class="w-full flex flex-col justify-center items-center h-full gap-y-3">
      <h3 class="text-4xl">Desculpe!</h3>
      <img src="./images/logo.jpg" alt="logo" />
      <div>Erro no servidor</div>
      <a href=<?= $urlbase ?>>
        <div>Voltar para a home</div>
    </section>
    </a>
  </main>
  <?php include(__DIR__ . "/../components/footer.php") ?>
</body>

</html>