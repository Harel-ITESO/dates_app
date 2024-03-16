"use strict";

$("#loginForm").on("submit", function (e) {
    e.preventDefault();
    const email = $("input[type=email]").val() || "";
    const password = $("input[type=password]").val() || "";
    const data = { user: { email, password } };
    $.ajax({
        method: "POST",
        url: "/login",
        data: JSON.stringify(data),
        contentType: "application/json",

        beforeSend: function () {
            loaderShow();
        },
        success: function () {
            window.location.replace("/home");
        },

        error: function (error) {
            alert(error.responseText);
        },

        complete: function () {
            loaderHide();
        },
    });
});
