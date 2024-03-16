"use strict";

// user's registration

$("#registerForm").on("submit", function (e) {
    e.preventDefault();
    const email = $("input[type=email]").val() || "";
    const password = $("input[type=password]").val() || "";
    const username = $("input[type=text]").val() || "";
    const data = { user: { email, password, username } };
    $.ajax({
        method: "POST",
        url: "/register",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function () {
            loaderShow();
        },
        success: function () {
            alert("Usuario registrado con exito");
            window.location.replace("/login");
        },
        complete: function () {
            loaderHide();
        },
    });
});
