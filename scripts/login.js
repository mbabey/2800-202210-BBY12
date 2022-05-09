'use strict';
const crypto = require('crypto');

docLoaded(() => {
    function postLogin() {
        let loginForm = document.querySelector('#login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop submit button from sending form.
            let inputUsername = loginForm.getElementsByName('username')[0].trim();
            let inputPassword = loginForm.getElementsByName('password')[0]; 
            const hash = crypto.createHash('sha256').update(inputPassword).digest('hex');
            let loginData = { username: inputUsername, password: hash };
            sendData(loginData);
        });

        async function sendData(data) {
            let res = await fetch('/login', {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data)
            });
            console.log('respnse obj: ' + res);
            let parse = res.json();
            console.log('json: ' + parse);
        }

    }
});

function docLoaded(action) {
    if (document.readyState != 'loading')
        action();
    else
        document.addEventListener('DOMContentLoaded', action);
}