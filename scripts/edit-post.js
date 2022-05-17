'use strict';
docLoaded(() => {
    console.log("aaa");
    function editPost(event){
        console.log(event.target.parentNode.parentNode.innerHTML);
    }
    let targets = document.querySelectorAll("#post-edit");
    targets.forEach((target)=>{
        target.addEventListener( "click", editPost, false);
    })
});

function docLoaded(action) {
    console.log("aaaa");
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

