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

  // Function from https://www.instagram.com/p/CdGXl-1PJZ1/?utm_source=ig_web_copy_link
  document.querySelectorAll('.login-input').forEach((input) => {
    input.addEventListener('blur', (e) => {
      if (e.target.value != "")
        e.target.nextElementSibling.classList.add('filled');
      else
        e.target.nextElementSibling.classList.remove('filled');
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
    console.log(response.status);
    if (response.status == 'success') {
      window.location.replace('/');
    } else if (response.status == 'egg') {
      window.location.replace('egg');
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
