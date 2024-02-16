$(document).ready(() => {
  $("#complete").hide();

  $("#button_change").click(function () {
    $("#excerpt").hide();
    $("#button_change").hide();
    $("#complete").show();
  });
});
