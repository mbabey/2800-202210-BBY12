'use strict';
const crypto = require('crypto');

docLoaded(() => {
    function postLogin() {
        document.querySelector('#login-form').addEventListener('submit', (e) => {
            e.preventDefault(); // Stop submit button from sending form.

        });

    async function sendData(data) {
        let res = await fetch('/login', {
            method: 'post',
            headers: {'content-type': 'application/json'}
        });
    } 

    } 
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}