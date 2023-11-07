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
        alertError("Please select an image file!");
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
    fileName.innerText = file.name;
    outputPath.innerText = path.join(os.homedir(), "imageresizer");
}

function sendImage(e) {
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imagePath = img.files[0].path;

    if (!img.files[0]) {
        alertError("Please upload an image");
        return;
    }
    if (width === "" || height === "") {
        alertError("Please fill in width and height");
        return;
    }

    ipcRenderer.send("image:resize", {
        imagePath,
        width,
        height,
    });
}

ipcRenderer.on("image:done", () =>
    alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`)
);

function isFileImage(file) {
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
    return file && acceptedImageTypes.includes(file["type"]);
}
function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: "red",
            color: "white",
            padding: "1rem",
        },
    });
}
function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: "green",
            color: "white",
            padding: "1rem",
        },
    });
}

img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);
