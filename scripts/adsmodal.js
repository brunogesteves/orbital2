$(document).ready(() => {
  // alert("oi");
  $(".modalAddAd").toggle();
  $(".modalEditAd").hide();
  $(".modalImages").hide();

  let today = new Date(),
    day = today.getDate(),
    month = today.getMonth() + 1, //January is 0
    year = today.getFullYear();
  hour = today.getHours();
  minute = today.getMinutes();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  today = year + "-" + month + "-" + day + "T" + hour + ":" + minute;

  $("#datetime").attr("min", today);

  $("#beginTime").attr("min", today);
  $("#finalTime").attr("min", today);

  $(".btnOpenEditModal").on("click", function () {
    var index = $(".btnOpenEditModal").index(this);
    $(`.modalEditAd:eq(${index})`).show();
  });

  $(".btnCloseEditModal").on("click", function () {
    var index = $(".btnCloseEditModal").index(this);
    $(`.modalEditAd:eq(${index})`).hide();
    $(".thumb-image").remove();
    $(".initialThumb").show();
  });

  $(".btnOpenAddNewPost").click(function () {
    $(".modalEditAd").toggle();
    $(".modalAddAd").show();
  });

  $(".btnCloseAdModal").click(function () {
    $(".modalAddAd").toggle();
    $(".modalEditAd").toggle();
    $(".thumb-image").remove();
    $(".initialThumb").show();
  });

  $(".btnModalOpenImages").on("click", function () {
    $(".modalImages").show();
  });

  $(".btnCloseModalImages").on("click", function () {
    $(".modalImages").hide();
  });

  $("img").click(function () {
    $(".thumb-image").remove();
    var image_holder = $(".image-holder");

    var alt = $(this).attr("alt");
    $("<img />", {
      src: `http://localhost/teste/images/${alt}`,
      // src: `https://orbitaltv.net/app/images/${alt}`,
      class: "thumb-image h-36",
    }).appendTo(image_holder);
    $(".initialThumb").hide();
    $(".imageThumb").val(alt);
    $(".modalImages").hide();
  });

  const now = new Date();
  const beginTimeDate = new Date($("#beginTime_text").val());
  if (beginTimeDate > now) {
    $("#beginEditTime").prop("readonly", "readonly");
  }

  const finalTimeDate = new Date($("#finalTime_text").val());
  if (finalTimeDate > now) {
    $("#finalTime").prop("readonly", "readonly");
  }
});
