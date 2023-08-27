// image changes according to click
const sideImages = document.querySelectorAll('.gallery-img-size');
const mainImage = document.getElementById('mainImage');

sideImages.forEach(image => {
    image.addEventListener('click', function (event) {
        const imageId = event.target.id;
        const imageUrl = `/productImages/${imageId}`;
        mainImage.setAttribute('src', imageUrl);
    });
});
// ================================================