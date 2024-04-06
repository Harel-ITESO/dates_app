const form = $("#uploadForm");

form.on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  $.ajax({
    url: "/files/upload/profile-pic",
    method: "POST",
    contentType: false,
    processData: false,
    data: formData,

    beforeSend: function () {
      loaderShow();
    },

    success: function () {
      window.location.reload();
    },

    complete: function () {
      loaderHide();
    },
  });
});

$("#uploadImageButton").on("click", function () {
  form.trigger("submit");
});
