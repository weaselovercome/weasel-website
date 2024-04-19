var namebox = document.getElementById("name");
var clicktext = "click for information";
namebox.innerHTML = clicktext;

var icons = document.getElementsByClassName("icon");
var infobox = document.getElementById("infobox");
var current = -1; // none selected

for (let i = 0; i < 5; i++) {
    icons[i].addEventListener("click", () => {
        setCharacter(i);
    });
}

function setCharacter(c) {
    if (current == c) {
        namebox.style.background = "";
        namebox.innerHTML = clicktext;
        infobox.style.background = "";
        infobox.innerHTML = "";
        icons[c].style.background = "";

        current = -1; // none selected
        return;
    }
    current = c;

    let bgColor = `var(--icon${c+1}`; // have to add ')' back in
    let bg = `linear-gradient( ${bgColor}b), ${bgColor}) )`;
    namebox.style.background = `linear-gradient( ${bgColor}b), ${bgColor}c) )`;
    infobox.style.background = `linear-gradient( ${bgColor}), ${bgColor}c) )`;

    for (let i = 0; i < 5; i++) {
        if (i == c) {
            icons[i].style.background = bg;
        } else {
            icons[i].style.background = "";
        }
    }

    namebox.innerHTML = names[c];
    infobox.innerHTML = characters[c];
}

/* i dont feel like making a fetching thing rn. thatll be later */
var names = [
    "hose",
    "magnifying glass",
    "ruler",
    "magnet",
    "alarm clock"
];

var characters = [
    "the shy one (?)",
    "massive bitch",
    "of everything<br><br>(not really)",
    "tism. no, the other one",
    "awesome cool"
];