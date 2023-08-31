
document.addEventListener('DOMContentLoaded', () => {

    //toggle image
    let profilePhoto = document.getElementsByClassName('profile-photo-add-icon')[0]; // Get the first element

    profilePhoto.addEventListener('click', (event) => {
        let profilePhotoForm = document.getElementById('addProfilePhoto');
        profilePhotoForm.classList.toggle('d-none');
    });

  

});
