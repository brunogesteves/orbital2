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
});
