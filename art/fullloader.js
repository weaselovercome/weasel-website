var images = [];

fetch("all.txt").then(response => response.text()).then((data) =>
    {
        images = data.split("\n");
        console.log(images);

        showImages(images);
        document.getElementById("total").innerHTML = `${images.length} images`;
    })
    .catch(err => fuckedup(err));

function fuckedup(err) {
    console.error("AHHH! IT BROKE\n" + err);
    
    let message = document.createElement("p");
    message.className = "bodytext error";
    message.innerHTML = "Something broke, sorry:<br>" + err;
    let container = document.getElementsByClassName("the-site")[0];
    let child = document.getElementById("all-container");
    container.insertBefore(message, child);
}

const container = document.getElementById("all-container");

function addImage(image) {
    // add headers for each year
    if (image.charAt(0) == "#") {
        var box = document.createElement("div");
        box.className = "yearbox";
        let year = image.substr(1);
        box.innerHTML = year;
        box.id = year;
        container.appendChild(box);

        return;
    }

    var box = document.createElement("div");
    box.className = "allbox";
    var a = document.createElement("a");
    a.href = image;
    box.appendChild(a);

    var img = document.createElement("img");
    img.src = image;
    a.appendChild(img);

    var p = document.createElement("p");
    p.innerHTML = image.substr(5);
    a.appendChild(p);

    container.appendChild(box);
}

function showImages(images) {
    for (let i = 0; i < images.length; i++) {
        addImage(images[i])
    }
}

// make year links scroll to their respecitve year
var years = document.getElementsByClassName("year");
for (let i = 0; i < years.length; i++) {
    years[i].addEventListener("click", () =>
    {
        document.getElementById(years[i].innerHTML).scrollIntoView();
    });
}