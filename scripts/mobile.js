$(document).ready(() => {
  $("#menu_open").on("click", function () {
    $("ul").addClass("translate-x-0");
    $("ul").removeClass("-translate-x-64");
    $("#menu_open").hide();
    $("#menu_open").removeClass("hidden");
    $("#menu_close").show();
  });
  $("#menu_close").on("click", function () {
    $("ul").removeClass("translate-x-0");
    $("ul").addClass("-translate-x-64");
    $("#menu_close").hide();
    $("#menu_open").show();
  });
  $("#menu_close").hide();

  const screenWidth = screen.width;
  console.log(screenWidth);
  if (screenWidth > 425) {
    $(".scrollable").css("width", screenWidth - 20);
  } else {
    $(".scrollable").css("width", screenWidth);
  }
});
