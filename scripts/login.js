'use strict';
// const crypto = require('crypto');

docLoaded(() => {
    let loginButton = document.querySelector('#login-submit');
    loginButton.addEventListener('click', () => {
        let inputUsername = document.getElementsByName('username')[0].value;
        let inputPassword = document.getElementsByName('password')[0].value;
        hashFunction(inputPassword).then((hash) => {
            sendData(JSON.stringify({ username: inputUsername, password: hash }));
        });
    });

    async function sendData(data) {
        await fetch('/login', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: data
        });
    }

    /* Function for hashing password using JS libraries.
        From: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest */
    async function hashFunction(text) {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}