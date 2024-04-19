const postcontainer = document.getElementById("posts");
var postError = false; // flag if there was an error loading a post. one or more

fetch("/posts/all.txt").then(response => {
    if (!response.ok) { // error
        throw new Error(`Posts couldn't be loaded:<br>${response.status} - ${response.statusText}`);
    }
    return response.text();
}).then(data => {
    var posts = data.split("\n");
    showPosts(posts);
}).catch(err => fuckedup(err, true));

function showPosts(posts) {
    for (let post of posts) {
        addPost(post);
    }
}

function addPost(name) {
    // set up post layout
    var post = document.createElement("div");
    post.className = "post";
    var date = document.createElement("div");
    date.className = "post-date";
    date.innerHTML = name; // name is actually just the date
    var title = document.createElement("p");
    title.className = "post-title";

    // put post stuff in BEFORE getting data so it does it in order
    post.appendChild(title);
    postcontainer.insertBefore(post, postcontainer.firstChild);

    // get data and put it into the post layout
    var data = new XMLHttpRequest();
    data.addEventListener("readystatechange", () => {
        // don't even bother if it's not done
        if (data.readyState < 4) {
            return;
        }

        // show error message at the top
        if (data.status >= 400) {
            if (postError) { // if this isn't the first time
                // add to existing error
                document.getElementById("posterror").innerHTML += `<br>${name} : ${data.status}`;
            } else {
                postError = true;
                fuckedup(`There was an error loading posts:<br>${name} : ${data.status}`, false);
            }
            post.remove(); // remove post display stuff
            return;
        }

        // put post data in now
        var postdata = data.responseText.split("\n");
        title.innerHTML = postdata[0];
        // start after title (postdata[0])
        for (let i = 1; i < postdata.length; i++) {
            let content = document.createElement("p");
            content.className = "post-content";
            var text = postdata[i];

            if (text.charAt(0) == "@") {
                // add class @'class' ...
                content.classList.add(text.substring(1,text.indexOf(" ")));
                text = text.substring(text.indexOf(" "));
            }

            content.innerHTML = text;
            post.appendChild(content);
        }

        // do image viewer stuff. copied from bigimage.js because im lazy
        var images = post.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            if (images[i].classList.contains("static")) {
                console.log("oooh");
            } else {
                images[i].style.cursor = "pointer";
                images[i].addEventListener("click", () => viewImage(images[i]));
            }
        }

        date.innerHTML = name;
        post.appendChild(date);
    });

    // make and send request, with error handling
    try {
        data.open("GET", `/posts/${name}.txt`);
        data.send();
    } catch (err) {
        data.abort(); // stop trying for request
        post.remove();
        return;
    }
}

// error display
function fuckedup(err, image) {
    console.log(err);
    var div = document.createElement("div");
    var error = document.createElement("p");
    error.className = "error"
    error.id = "posterror";
    error.innerHTML = err;
    div.appendChild(error);
    div.style.marginBottom = "30px";
    postcontainer.insertBefore(div, postcontainer.firstChild);

    if (!image) return;
    var coolImage = document.createElement("img");
    coolImage.src = "/image/error.png";
    coolImage.style.width = "500px";
    coolImage.style.margin = "0 auto";
    div.appendChild(coolImage);
}