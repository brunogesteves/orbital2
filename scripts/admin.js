$(document).ready(() => {
  $(".modalpost").hide();

  $(".openmodal").on("click", function () {
    var index = $(".openmodal").index(this);
    $(`.modalpost:eq(${index})`).show();
  });

  $(".closemodal").on("click", function () {
    var index = $(".closemodal").index(this);
    $(`.modalpost:eq(${index})`).hide();
  });

  console.log("teste: ", $("#summary").text());
});
