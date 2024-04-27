const likeButtons = $(".like");
const dislikeButtons = $(".dislike");

const len =
  likeButtons.length === dislikeButtons.length ? likeButtons.length : 0; // this should not happen but just in case ...

// create event for both like and dislike
for (let i = 0; i < len; i++) { }
