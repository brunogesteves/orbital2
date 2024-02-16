$(document).ready(function () {
  $(".modal_form_ad").hide();
  $("#menu_close").hide();
  $("#complete").hide();

  $("#open_form_Ad").on("click", function () {
    $(".modal_form_ad").show();
  });

  $("#button_change").click(function () {
    $(".excerpt").hide();
    $("#complete").show();
    $("#button_change").hide();
  });

  $("#scrollToUp").click(function () {
    $("body").animate({ scrollTop: 0 }, "500");
  });

  $("#fileUploadAd").on("change", function () {
    var imgPath = $(this)[0].value;
    var extn = imgPath.substring(imgPath.lastIndexOf(".") + 1).toLowerCase();

    if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
      if (typeof FileReader != "undefined") {
        var image_holder = $("#image_holder_ad");
        image_holder.empty();

        var reader = new FileReader();
        reader.onload = function (e) {
          $("<img />", {
            src: e.target.result,
            class: "thumb-image",
          }).appendTo(image_holder);
        };
        image_holder.show();
        // $('#image_update').hide();

        reader.readAsDataURL($(this)[0].files[0]);
      } else {
        alert("This browser does not support FileReader.");
      }
    } else {
      alert("Extensão de foto não aceita");
    }
  });

  $("#cancel_ad").click(function () {
    $(".modal_form_ad").hide();
  });
});
