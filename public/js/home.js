const message = "¿Estás seguro que quieres cerrar tu sesión?";
$("#logoutButton").on("click", function () {
  if (confirm(message)) {
    loaderShow();
    $.get("/home/logout").done(() => {
      loaderHide();
      window.location.replace("/");
    });
  }
});
