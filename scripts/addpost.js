$(document).ready(() => {
  $("textarea").hide();
  $("#modalpost").hide();

  const editor = SUNEDITOR.create(
    document.getElementById("sample"),

    {
      value: "",
      mode: "classic",
      rtl: false,
      katex: "window.katex",
      width: "90%",
      height: "50vh",
      placeholder: "Crie o post....É obrigatório",
      imageGalleryUrl: "http://localhost/teste/components/admin/gallery.php",
      // imageGalleryUrl: "https://orbitaltv.net/app/components/admin/gallery.php",
      videoFileInput: false,
      audioUrlInput: false,
      tabDisable: false,
      buttonList: [
        [
          "undo",
          "redo",
          "font",
          "fontSize",
          "formatBlock",
          "paragraphStyle",
          "blockquote",
          "bold",
          "underline",
          "italic",
          "strike",
          "subscript",
          "superscript",
          "fontColor",
          "hiliteColor",
          "textStyle",
          "removeFormat",
          "outdent",
          "indent",
          "align",
          "horizontalRule",
          "list",
          "lineHeight",
          "table",
          "link",
          // "image",
          // 'video',
          "audio",
          "math",
          "imageGallery",
          "fullScreen",
          "showBlocks",
          "codeView",
          // 'preview',
          "print",
          "save",
          "template",
        ],
      ],
      lang: SUNEDITOR_LANG.pt_br,
      "lang(In nodejs)": "pt_br",
    }
  );

  editor.onChange = function (contents) {
    $("#summary").val(contents);
  };

  editor.onInput = function (contents) {
    let value = contents.target.innerHTML;
    $("#summary").val(value);
  };

  $("#openmodal").on("click", function () {
    editor.hide();
    $("#modalpost").show();
  });

  $("#closemodal").on("click", function () {
    editor.show();

    $("#modalpost").hide();
  });

  $("img").click(function () {
    $(".thumb-image").remove();

    var image_holder = $("#image-holder");

    var alt = $(this).attr("alt");
    $("<img />", {
      src: `http://localhost/teste/images/${alt}`,
      class: "thumb-image w-auto h-20",
    }).appendTo(image_holder);
    editor.show();
    $("#modalpost").hide();
    $("#imageThumb").val(alt);
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
