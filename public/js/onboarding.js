// get all the sections and buttons
const sections = [];
const nextButtons = [];
for (let i = 1; i <= 5; i++) {
  sections.push($(`#section-${i}`));
}

// set the section selection
let sectionIndex = 0;
let selectedSection = sections[sectionIndex];
let image = "";

// interests buffer array
const interestsBufferIds = [];

// functions

// get the profile profile-pic
function getProfilePicFileReader(input) {
  let fileReader = null;
  if (input.files && input.files[0]) {
    fileReader = new FileReader();
    fileReader.readAsDataURL(input.files[0]);
  }
  return fileReader;
}

// handle description change
$("#descriptionTextArea").on("input", function() {
  var maxlength = $(this).attr("maxlength");
  var currentLength = $(this).val().length;

  if (currentLength <= maxlength) {
    $("#charsLeft").text(currentLength);
  }
});

// handle profile-pic ( saves it on the current buffer )
$("#profilePicSelector").on("change", function() {
  const fileReader = getProfilePicFileReader(this);
  if (fileReader) {
    fileReader.onload = function(e) {
      image = e.target.result;
      $("#profilePicBuffer").attr("src", e.target.result);
    };
  }
});

// on interest button click
$(".interest-button").on("click", function() {
  const foundIndex = interestsBufferIds.findIndex((v) => v === this.id);

  if (foundIndex === -1 && interestsBufferIds.length === 5) return;

  if (foundIndex === -1) interestsBufferIds.push(this.id);

  if (foundIndex > -1) interestsBufferIds.splice(foundIndex, 1);

  this.classList.toggle("btn-outline-success");
  this.classList.toggle("btn-warning");
});

$(".next-button").on("click", function() {
  selectedSection.addClass("d-none");
  sectionIndex++;
  selectedSection = sections[sectionIndex];
  selectedSection.removeClass("d-none");
});

$(".before-button").on("click", function() {
  selectedSection.addClass("d-none");
  sectionIndex--;
  selectedSection = sections[sectionIndex];
  selectedSection.removeClass("d-none");
});

// handle ajax request
$("#endButton").on("click", async function() {
  loaderShow();
  try {
    // upload profile pic
    const formData = new FormData($("#profilePicForm")[0]);
    const inpFile = $("#profilePicSelector")[0];
    formData.append("profile_pic", inpFile.files[0]);
    await $.ajax({
      method: "POST",
      url: "/files/upload/profile-pic",
      contentType: false,
      processData: false,
      cache: false,
      data: formData,
    });

    // update user interests
    await $.ajax({
      method: "POST",
      url: "/users/current/interests",
      data: JSON.stringify({
        interests: interestsBufferIds.map((i) => {
          return { interestId: Number.parseInt(i) };
        }),
      }),
      contentType: "application/json",
    });

    // update description and set isNew to false
    const data = { isNew: false, description: $("#descriptionTextArea").val() };
    console.log(data);
    await $.ajax({
      method: "PUT",
      url: "/users/current",
      contentType: "application/json",
      data: JSON.stringify({ data }),
    });

    window.location.replace("/");
  } catch (e) {
    console.error(e);
  }
  loaderHide();
});
