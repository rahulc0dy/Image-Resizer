// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const fileName = document.querySelector("#filename");
const widthInput = document.querySelector("#width");
const heightInput = document.querySelector("#height");

function loadImage(e) {
    const file = e.target.files[0];

    if (!isFileImage(file)) {
        alert("Please select an image file");
        return;
    }
    // Get original Dimentsions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    };

    form.style.display = "block";
    fileName.innerHTML = file.name;
}

function isFileImage(file) {
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
    return file && acceptedImageTypes.includes(file["type"]);
}

img.addEventListener("change", loadImage);
