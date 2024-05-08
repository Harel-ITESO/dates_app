$('.like').on('click', function() {
    const userId = $(this).data('user-id');
    $.ajax({
        url: `/premium/like`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ toUserId: userId, isLike: 1 }),
        success: function(response) {
            if (response.success) {
                alert(response.message);
                $(`#user-card-${userId}`).fadeOut();
            } else {
                alert('Like registrado, pero aún no se ha formado un match.');
            }
        },
        error: function(xhr) {
            alert('Error al procesar tu like: ' + xhr.responseText);
        }
    });
});

$('.dislike-button').on('click', function() {
    const userId = $(this).data('user-id');
    $.ajax({
        url: '/premium/dislike',
        method: "POST",
        contentType: "application/json", 
        data: JSON.stringify({ toUserId: userId, isLike: 0 }), 
        success: function(response) {
            if (response.success) {
                $('#user-card-' + userId).fadeOut();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function(xhr) {
            alert('Error al procesar el dislike: ' + xhr.responseText);
        }
    });
});