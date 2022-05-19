'use strict';
let template;


docLoaded(() => {
    getSearchData('/get-template?', getTemplate);
    getSearchData('/get-filter-posts?', renderPosts);
    getSearchData('/get-filter-users?', renderUsers);
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}

function search() {
    //getSearchData('/get-filter-users', renderUsers);
    getSearchData('/get-filter-posts', renderPosts);
}

async function getSearchData(path, callback) {
    try {
        let response = await fetch(path + new URLSearchParams(window.location.search), {
            method: 'GET'
        });
        if (response.status == 200) {
            response = await response.text();
            response = JSON.parse(response);
            callback(response);
        }
    } catch (err) { console.log(err); }
}

function getTemplate(response) {
    template = response.dom;
}

function renderUsers(users) {
    for (let i = 0; i < users.users.length; i++) {
        console.log(users.users[i]);
    }
}

function renderPosts(posts) {
    for (let i = 0; i < posts.posts.length; i++) {
        console.log(posts.posts[i]);
    }
}
