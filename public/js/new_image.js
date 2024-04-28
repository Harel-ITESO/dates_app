document.querySelector('.profile-img').addEventListener('click', function() {
    document.getElementById('profilePic').click();
});

function previewAndShowModal() {
    const file = document.getElementById('profilePic').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.profile-img').src = e.target.result;
        };
        reader.readAsDataURL(file);

        const modal = new bootstrap.Modal(document.getElementById('profilePicModal'));
        modal.show();  
    }
}

function saveProfilePic() {
    const fileInput = document.getElementById('profilePic');
    if (fileInput.files.length === 0) {
        console.log("No file selected.");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('profile_pic', file);

    fetch('/files/upload/profile-pic', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        // Aquí aseguramos que el contenido es realmente JSON antes de procesarlo
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error("Received non-JSON response from server: " + text);
            }
        });
    })
    .then(data => {
        console.log('Success:', data);
        const modal = bootstrap.Modal.getInstance(document.getElementById('profilePicModal'));
        modal.hide();
        document.querySelector('.profile-img').src = data.filePath + '?' + new Date().getTime();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
