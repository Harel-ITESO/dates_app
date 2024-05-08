const likeButtons = $(".like");
const dislikeButtons = $(".dislike");

likeButtons.on("click", function() {
  const container = $(this.parentElement.parentElement);
  const userId = parseInt(container.attr("id").split("-")[1]);
  loaderShow();
  sendLikeToUser(userId, true).then(() => {
    loaderHide();
    if (confirm("Tienes un nuevo match, ¿Deseas ir a verlo?"))
      window.location.replace("/home/matches");
  });
});

dislikeButtons.on("click", function() {
  const container = $(this.parentElement.parentElement);
  const userId = parseInt(container.attr("id").split("-")[1]);
  loaderShow();
  sendLikeToUser(userId, false).then(() => {
    loaderHide();
  });
});

async function sendLikeToUser(userId, isLike) {
  return new Promise(async (resolve, reject) => {
    await $.ajax({
      url: `/match/like?toUserId=${userId}&isLike=${isLike}`,
      method: "POST",
      success: function(data, _textStatus, xhr) {
        resolve([data, xhr.status]);
      },
      error: function(res) {
        reject(res);
      },
    });
  });
}
