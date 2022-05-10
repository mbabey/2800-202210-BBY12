'use strict';

docLoaded(() => {
    let loginButton = document.querySelector('#login-submit');
    loginButton.addEventListener('click', () => {
        let inputUsername = document.getElementsByName('username')[0].value;
        let inputPassword = document.getElementsByName('password')[0].value;
        // hashFunction(inputPassword).then((hash) => {
        //     sendData(JSON.stringify({ username: inputUsername, password: hash }));
        // });
        sendData({ username: inputUsername, password: inputPassword });
    });

    async function sendData(data) {
        try {
            console.log(data);
            console.log(JSON.stringify(data));
            let res = await fetch('/login', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            console.log("Response obj: ", res);
            let parsed = await res.json();
            console.log("From the server: ", parsed);
        } catch (err) {
            console.log(err);
        }
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