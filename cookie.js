// better one
function getCookie(name) {
    var pos = document.cookie.search(name);
    if (pos < 0) return null; // no cookie with that name

    pos += name.length + 1; // set pos after name=
    return document.cookie.substring(pos).split(";")[0];
}