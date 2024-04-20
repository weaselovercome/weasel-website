var images;
var ready = false;
var parameters; //  sorting parameters
var fullsize; // screen size

function getSize() {
    fullsize = window.screen.width > 600;
}

getSize();

// get url parameters
var url = window.location.href;
var paramstring;
let start = url.indexOf("?");
if (start > 0) { // there are parameters
    paramstring = url.substring(start);
    console.log(paramstring);
    url = url.substring(0, start); // everything before paramstring
    
    parameters = getParam(paramstring);
}
console.log(url);

// firefox hates me and URLSearchParams sometimes doesn't work ????????
function getParam(paramstring) {
    // remove "&" and split into statements of "a=b"
    var split = paramstring.substring(1).split("&");
    var params = new Map();

    for (let i = 0; i < split.length; i++) {
        statement = split[i].split("="); // {a, b}
        params.set(statement[0], statement[1]);
    }
    return params;
}

// get json file. it's big (i think)
fetch("full.json").then(response => response.json()).then((data) => 
    {
        images = data.images;
        doTheThing(images);
        ready = true;
    })
    .catch(err => fuckedup(err));

// reset if screen becomes big enough or too small
window.addEventListener("resize", (e) => {
    if ((window.screen.width < 600 && fullsize) ||
        (window.screen.width >= 600 && !fullsize)) {
            getSize();
            clear();
            doTheThing(images);
    }
});

function doTheThing(images) {
    var tmp = [];
    // reverse images if ordering by newest
    if (getCookie("order") == "oldest") {
        tmp = images;
    } else {
        tmp = reverse(images);
    }

    // set tag if there is one
    var tag;
    if (parameters) tag = parameters.get("tag");
    var j = 0; // counter of images shown
    for (let i = 0; i < tmp.length; i++) {
        // add image if there isn't a tag requirement or if it fits criteria
        // and it isn't hidden (check that first)
        if (!tmp[i].hide && (!tag || checkTags(tag, tmp[i]))) {
            // add to column depending on number
            addImage(tmp[i], j % 3);
            j++;
        }
    }

    showInfo(j);
}

function reverse(images) {
    var tmp = [];
    for (let i = 0; i < images.length; i++) {
        tmp[i] = images[images.length-i-1];
    }

    return tmp;
}

// clear all the images
function clear() {
    let container = document.getElementById("art-container");
    let children = container.children;
    // different if screen is small
    let len = fullsize ? 3 : 1;

    // for c1, c2 and c3
    for (let i = 0; i < len; i++) {
        children[i].innerHTML = "";
    }

    console.log("images cleared");
}

function fuckedup(err) {
    console.error("AHHH! IT BROKE\n" + err);
    
    let message = document.createElement("p");
    message.className = "bodytext error";
    message.innerHTML = "Something broke, sorry:<br>" + err;
    let container = document.getElementsByClassName("the-site")[0];
    let child = document.getElementById("art-container");
    container.insertBefore(message, child);
}

function addImage(test, column) {
    // get tags
    if (test.tags) {
        var tags = test.tags.split(" ");
    }

    // create artbox
    var box = document.createElement("div");
    box.className = "artbox";
    // add image
    var img = document.createElement("img");
    img.id = "art";
    img.addEventListener("click", () => viewImage(img));
    // gifs have extension baked in, otherwise assume png
    let name = test.filename;
    if (name.substr(name.length-4) != ".gif") {
        name += ".png";
    }
    img.src = name;
    img.title = name.substr(5); // remove year folder from title
    box.appendChild(img);

    // add info
    var info = document.createElement("div");
    info.className = "info";
    var desc = document.createElement("p");
    desc.innerHTML = test.description;
    info.appendChild(desc);
    var program = document.createElement("p");
    program.innerHTML = "Made in <span>" + test.program + "</span>";
    info.appendChild(program);
    if (test.tags) { // skip if no tags
        var tagstext = document.createElement("p");
        tagstext.id = "tags";
        tagstext.innerHTML = tagString(tags);
        info.appendChild(tagstext);
    }
    var date = document.createElement("p");
    date.id = "date";
    date.innerHTML = test.date;
    info.appendChild(date);
    // put info onto box
    box.appendChild(info);

    // add box
    var add;
    if (fullsize) { // only do columns if screen wide enough
        add = document.getElementById("c" + (column+1));
    } else {
        add = document.getElementById("c1");
    }
    add.appendChild(box);
}

console.log("done");

// sorting and cookie stuff

const sortInfo = document.getElementById("sort");
function showInfo(images) {
    // total number of images
    var total = document.getElementById("total");
    total.innerHTML = `${images} images`;

    // how theyre being sorted
    var text = "Sorting by ";

    // default newest
    if (getCookie("order") == "oldest") {
        text += "oldest";
    } else {
        text += "newest";
    }
    
    sortInfo.innerHTML = text;

    // append tag information
    let tag;
    if (parameters && !document.getElementById("tag")) {
        tag = parameters.get("tag");
        if (tag) {
            text = 'Showing images tagged <i>' + tag + '</i>';
            if (!fullsize) {
                text += ' <xbutton>(x)</xbutton>';
            }

            var tagbox = document.createElement("a");
            tagbox.id  = "tag";
            tagbox.title = "Remove tag";
            tagbox.innerHTML = text;
            tagbox.href = url;
            sortInfo.parentElement.appendChild(tagbox);
        }
    }
}

function swapOrder() {
    if (!ready) return; // don't do anything unless images are loaded
    console.log("current cookie: " + document.cookie);

    clear();

    if (getCookie("order") != "oldest") { // newest or null
        document.cookie = 'order=oldest';
    } else {
        document.cookie = 'order=newest';
    }

    doTheThing(images);
}

function checkTags(tag, image) {
    if (!image.tags) return false; // dont bother if it doesnt have tags
    var tags = image.tags.split(" "); // list of image's tags
    var pass = false; // true if it matches

    for (let  i = 0; i < tags.length; i++) {
        //console.log(tags[i] + " " + tag);
        if (tags[i] == tag) {
            pass = true;
        }
    }

    return pass;
}

// formatting
function tagString(tags) {
    str = "";
    for (let i = 0; i < tags.length; i++) {
        str += `<a href="${url}?tag=${tags[i]}">${tags[i]}</a>`;
        if (i < tags.length-1) {
            str += ", ";
        }
    }

    return str;
}