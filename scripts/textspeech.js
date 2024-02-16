$(document).ready(() => {
  if ("speechSynthesis" in window) {
    console.log("sim");
    $("#resume").hide();
    $("#stop").hide();
    $("#pause").hide();

    $("#play").click(function (e) {
      $("#stop").show();
      $("#pause").show();
      $("#play").hide();

      e.preventDefault();
      let voices = speechSynthesis.getVoices();

      let t2xs = new SpeechSynthesisUtterance();
      t2xs.text = $("#msg").text();
      t2xs.voice = voices[14];
      speechSynthesis.cancel();
      speechSynthesis.speak(t2xs);
      t2xs.onend = (e) => {
        $("#play").show();
        $("#stop").hide();
        $("#pause").hide();
        $("#resume").hide();
      };
    });
  }

  $("#resume").click(function () {
    speechSynthesis.resume();
    $("#pause").show();
    $("#resume").hide();
  });
  $("#pause").click(function () {
    speechSynthesis.pause();
    $("#pause").hide();
    $("#resume").show();
  });
  $("#stop").click(function () {
    speechSynthesis.cancel();
    $("#play").show();
    $("#stop").hide();
    $("#pause").hide();
    $("#resume").hide();
  });
});
