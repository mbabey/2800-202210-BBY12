document.getElementById("input-tag").addEventListener("keypress", function (e) {
    if (checkKey(e)) {
        e.preventDefault();
        writeTag();
    }
});
document.getElementById("input-title").addEventListener("keypress", function (e) {
    if (checkKey(e)) {
        e.preventDefault();
    }
});

function checkKey(e) {
    let key = e.charCode || e.keyCode || 0;
    return (key == 13);
}

function writeTag() {
    let tagField = document.getElementById("tag-field");
    const re = /[\s,]/;
    let tags = document.getElementById("input-tag").value.split(re);
    tags.forEach(tag => {
        if (tag) tagField.value += "#" + tag + " ";
    });
    document.getElementById("input-tag").value = "";
}