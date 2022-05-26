'use strict';

docLoaded(() => {
  document.querySelector('#create-submit').addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.querySelector('input[name=\'username\']').value;
    const password = document.querySelector('input[name=\'password\']').value;
    const passwordVerify = document.querySelector('input[name=\'password-verify\']').value;
    const email = document.querySelector('input[name=\'email\']').value;
    const emailVerify = document.querySelector('input[name=\'email-verify\']').value;
    if (checkData(password, passwordVerify, email, emailVerify)) {
      let data = {
        username: username,
        password: password,
        email: email
      };
      sendData(data);
    }
  });

  // Add listener to each input to activate button on enter press.
  document.querySelectorAll('.input').forEach((input) => {
    input.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) { // If key pressed is enter key
        document.querySelector('#create-submit').click();
      }
    });
  });
});

function checkData(password, passwordVerify, email, emailVerify) {
  // Password must have one letter, one number, one special character, and be at least 8 characters. From https://stackoverflow.com/a/21456918
  let regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!regex.test(password)) {
    document.querySelector('#error-message').innerHTML = 'Error! Password must match required pattern!';
    return false;
  }
  if (email != emailVerify) {
    document.querySelector('#error-message').innerHTML = 'Error! Email fields must match!';
    return false;
  }
  if (password != passwordVerify) {
    document.querySelector('#error-message').innerHTML = 'Error! Password fields must match!';
    return false;
  }
  return true;
}

async function sendData(data) {
  try {
    let response = await fetch('/create-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    response = await response.text();
    response = JSON.parse(response);
    if (response.status == 'success') {
      window.location.replace('/');
    } else {
      document.querySelector('#error-message').innerHTML = 'Error! Account with same username already exists!';
    }
  } catch (err) {
    if (err) throw err;
  }
}

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}
