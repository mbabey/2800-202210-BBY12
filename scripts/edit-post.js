'use strict';
docLoaded(() => {
    console.log("aaa");
    function editPost(event) {
        console.log("Edit");
    }
    function savePost(event) {
        console.log("saved");
    }

    let editButtons = document.querySelectorAll("#post-edit");
    editButtons.forEach((target) => {
        target.addEventListener("click", editPost, false);
    });

    let saveButtons = document.querySelectorAll("#post-save");
    saveButtons.forEach((target) => {
        target.addEventListener("click", savePost, false);
    });
});

function docLoaded(action) {
    console.log("aaaa");
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

