$(document).ready(function () {
  $(".sliderArea").on("mousemove", function (e) {
    let mousePosition = e.pageX - e.currentTarget.offsetLeft;
    let slideArea = $(".sliderArea").width() / 2;
    if (mousePosition > slideArea) {
      $(".nextImg").show();
      $(".previewImg").hide();
    } else if (mousePosition < slideArea) {
      $(".nextImg").hide();
      $(".previewImg").show();
    }
  });

  $(".sliderArea").on("mouseleave", function () {
    $(".nextImg").hide();
    $(".previewImg").hide();
  });

  $(".slider").slick({
    dots: false,
    infinite: true,
    prevArrow: $(".previewImg"),
    nextArrow: $(".nextImg"),
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
  });
});
