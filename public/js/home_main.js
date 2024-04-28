// users are shown as a stack, and each like/dislike events pops it from the stack and renders the next one
const userCardsStack = Array.from(document.querySelectorAll(".other-user"));
const stackTop = 0;

// pop the firstUser and render
function renderNextUser() {
  const rawUser = userCardsStack.shift();
  if (!rawUser) return renderOnNoUsersLeft();

  const user = $(rawUser);
  const likeButton = user.find(".like");
  const dislikeButton = user.find(".dislike");
  const userId = rawUser.id.split("-")[1];

  likeButton.on("click", function() {
    loaderShow();
    sendLikeToUser(userId, "1").then((res) => {
      const [_responseText, status] = res;
      if (status === 202) {
        if (confirm("Tienes un nuevo match, ¿Deseas ir a verlo?"))
          window.location.replace("/home/matches");
      }
      loaderHide();
      renderNextUser();
      user.addClass("d-none");
    });
  });

  dislikeButton.on("click", function() {
    loaderShow();
    sendLikeToUser(userId, "0").then(() => {
      loaderHide();
    });
    renderNextUser();

    user.addClass("d-none");
  });

  user.removeClass("d-none");
}

async function sendLikeToUser(userId, isLike) {
  return new Promise(async (resolve, reject) => {
    await $.ajax({
      url: `match/like?toUserId=${userId}&isLike=${isLike}`,
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

// render on no more users
function renderOnNoUsersLeft() {
  $(".main-container").html("<h2>No hay más usuarios</h2>");
}

// render firstUser;
renderNextUser();
