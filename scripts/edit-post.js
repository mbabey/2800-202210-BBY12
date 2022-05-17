'use strict';
docLoaded(() => {
    async function editPost(event) {
        let post = event.target.parentNode.parentNode;
        console.log('/get-post/'+ post.dataset.username +'/' + post.dataset.postId);

        try {
            let response = await fetch('/get-post/'+ post.dataset.username +'/' + post.dataset.postId, {
                method: 'GET'
            });
            if (response.status == 200) {
                let data = await response.text();
                console.log(JSON.parse(data));
            }
        } catch (err) {

        }
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
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

