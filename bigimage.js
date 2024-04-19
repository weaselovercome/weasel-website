var load = true; // manually set to false when it shouldnt set the images itself

// set up image viewing stuff
var body = document.getElementsByTagName("body")[0]; // to put bg onto later
var bg = document.createElement("div");
bg.className = "bg";
var img = document.createElement("img");
img.className = "bigimage";
img.title = "i messed it up. can you tell me please"; // in case i break something
bg.appendChild(img);

// listen for click or escape/enter key
bg.addEventListener("click", () => hideImage());
document.addEventListener("keydown", (event) => {
    var key = event.code;
    if (key == "Escape" || key == "Enter") {
        hideImage();
    }
});


// add event listener to all images
var images = document.getElementsByTagName("img");
for (let i = 0; i < images.length; i++) {
    if (images[i].classList.contains("static")) {
        console.log("oooh");
    } else {
        images[i].style.cursor = "pointer";
        images[i].addEventListener("click", () => viewImage(images[i]));
    }
}
console.log(images);

function viewImage(image) {
    console.log(image.src);
    img.src = image.src;
    img.title = image.title;
    body.appendChild(bg);
    body.style.overflowY = "hidden";
}

function hideImage() {
    body.removeChild(bg);
    body.style.overflowY = "scroll";
}