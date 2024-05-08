function setFormSubmit(jqueryFormElement) {
  jqueryFormElement.on("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    $.ajax({
      url: "/files/upload/profile-pic",
      method: "POST",
      contentType: false,
      processData: false,
      data: formData,
    });
  });
}
