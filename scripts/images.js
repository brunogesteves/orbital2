$(document).ready(function () {
  $("#fileUpload").on("change", function () {
    $("#thumb").hide();
    var imgPath = $(this)[0].value;

    if (typeof FileReader != "undefined") {
      var image_holder = $("#image-holder");
      image_holder.empty();

      var reader = new FileReader();
      reader.onload = function (e) {
        $("<img />", {
          src: e.target.result,
          class: "thumb-image w-72 h-auto",
        }).appendTo(image_holder);
      };
      image_holder.show();
      reader.readAsDataURL($(this)[0].files[0]);
    }
  });
});
