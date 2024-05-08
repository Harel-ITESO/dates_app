const acceptButton = $(".btn-primary");
const userId = parseInt(acceptButton[0].id.split("-")[1]);

acceptButton.on("click", async function() {
  loaderShow();
  try {
    const data = {
      hasSuscription: true,
    };
    await $.ajax({
      method: "PUT",
      url: "/users/current",
      contentType: "application/json",
      data: JSON.stringify({ data }),
    });
    window.location.replace("/");
  } catch (e) {
    console.log(e);
  }
  loaderHide();
});
