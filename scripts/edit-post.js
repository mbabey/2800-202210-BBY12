'use strict';
docLoaded(() => {
    console.log("aaa");
    function editPost(event){
        console.log(event.target.parentNode.parentNode.innerHTML);
    }
    let target = document.querySelector("#post-edit");
    target.addEventListener( "click", editPost, false);
});

function docLoaded(action) {
    console.log("aaaa");
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

