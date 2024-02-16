$(document).ready(() => {
  setInterval(() => {
    const date = new Date();
    const dateFormat = new Intl.DateTimeFormat("pt-BR", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    $(".timestamp").text(dateFormat.format(date));
  }, 1000);
});
