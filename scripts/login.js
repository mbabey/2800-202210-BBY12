const { getDocumentTypeNodeSystemId } = require("jsdom/lib/jsdom/living/domparsing/parse5-adapter-serialization");

docLoaded(() => {
  ['click'].forEach(e => {
    document.querySelector('#login-submit').addEventListener(e, () => {
      let data = { username: document.querySelector('input[\'username\']'), 
      password: document.querySelector('input[\'password\']') };
      
      sendData(data);
    });
  });
  document.querySelector('#login-submit').addEventListener('click')
});

async function sendData(data) {
  try {
      let response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });
      if (response.status == 'loginFailure') {
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