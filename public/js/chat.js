const socket = io("/");
const chatForm = $("#chatForm");
const chatContainer = $("#chatContainer");
const input = chatForm.find("input");
const thisUserId = parseInt(chatContainer.attr("name").split("-")[1]);
const thisMatchId = parseInt(window.location.pathname.split("/")[3]);

input.val("");

// join the current match room
socket.emit("joinChat", [thisUserId, thisMatchId]);

// on other's user connect
// TODO: This must work on the two ways around
socket.on("otherUserConnection", (userId) => {
  if (userId !== thisUserId) {
    $("#otherUserStatus").html("En línea");
  }
});

socket.on("sendMessage", (data) => {
  let type = "mine";
  $(".sending-msg").remove();
  if (data.senderId !== thisUserId) type = "other";
  renderNewMessage(type, data);
});

function createNewMessage(type, data) {
  const message = document.createElement("div");
  message.id = data.messageId;
  message.textContent = data.textContent;
  if (type === "mine" || type === "other") {
    const hour = document.createElement("small");
    hour.textContent = new Date(data.sendAt).toLocaleTimeString("es-MX");
    hour.classList.add("message-time");
    message.appendChild(hour);
  }

  message.classList.add("message", "rounded-pill");

  switch (type) {
    case "mine":
      message.classList.add("this-user-msg");
      break;
    case "other":
      message.classList.add("other-user-msg");
      break;
    case "sending":
      message.classList.add("sending-msg");
      break;
  }
  return message;
}

function renderNewMessage(type, textContent) {
  const message = createNewMessage(type, textContent);
  chatContainer.append(message);
  $(`#${message.id}`)[0].scrollIntoView();
}

chatForm.on("submit", function(e) {
  e.preventDefault("sending");
  const message = input.val();
  if (!message) return;
  renderNewMessage("sending", { textContent: message });
  socket.emit("newMessage", {
    message,
    matchId: thisMatchId,
    sender: thisUserId,
  });
  input.val("");
});
