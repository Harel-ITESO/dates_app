"use strict";

// some helper functions and data
function loaderShow() {
    $(".spinner-container").removeClass("d-none");
    $(".spinner-container").addClass("d-flex");
}

function loaderHide() {
    $(".spinner-container").removeClass("d-flex");
    $(".spinner-container").addClass("d-none");
}

const statusCodes = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
};
