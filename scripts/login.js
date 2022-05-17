docLoaded(() => {
  document.querySelector('#login-submit').addEventListener('click', () => {
    let data = {
      username: document.querySelector('input[name=\'username\']').value,
      password: document.querySelector('input[name=\'password\']').value
    };
    sendData(data);
  });

  // Add listener to each input to activate button on enter press.
  document.querySelectorAll('.login-input').forEach((input) => {
    input.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) { // If key pressed is enter key
        document.querySelector('#login-submit').click();
      }
    });
  });
});

async function sendData(data) {
  try {
    let response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    response = await response.text();
    response = JSON.parse(response);
    if (response.status == 'success') {
      window.location.replace('/');
    } else {
      document.querySelector('#error-message').innerHTML = 'Error! Username/password combination not found!';
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