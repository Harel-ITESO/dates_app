const socket = io("/");
const chatForm = $("#chatForm");
const chatContainer = $("#chatContainer");
const input = chatForm.find("input");
const thisUserId = parseInt(chatContainer.attr("name").split("-")[1]);
input.val("");

socket.emit();

socket.on("newMessage", (data) => {
  let type = "mine";
  console.log(data.sender, thisUserId);
  if (data.sender !== thisUserId) type = "other";
  renderNewMessage(type, data.message);
});

function createNewMessage(type, textContent) {
  const message = document.createElement("div");
  (message.style.display = "flex"), (message.style.minHeight = "min-content");
  message.textContent = textContent;
  message.classList.add("p-1", "rounded-pill");
  if (type === "mine") message.classList.add("bg-warning", "align-self-end");
  if (type === "other") {
    message.classList.add("align-self-start");
    message.style.backgroundColor = "#eee";
  }

  return message;
}

function renderNewMessage(type, textContent) {
  const message = createNewMessage(type, textContent);
  chatContainer.append(message);
}

chatForm.on("submit", function(e) {
  e.preventDefault();
  const message = input.val();
  if (!message) return;
  socket.emit("newMessage", {
    message,
    id: thisUserId,
  });
  input.val("");
});
