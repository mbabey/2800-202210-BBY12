docLoaded(() => {
  ['click'].forEach(e => {
    document.querySelector('#login-submit').addEventListener(e, () => {
      let data = { username: document.querySelector('input[name=\'username\']').value, 
      password: document.querySelector('input[name=\'password\']').value };
      console.log(data);
      sendData(data);
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
      console.log(response);
      response = await response.text();
      console.log(response);
      response = JSON.parse(response);
      console.log(response);
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