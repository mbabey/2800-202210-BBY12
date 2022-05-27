'use strict';

/**
 * Loading the webpage and be ready to store the input values of create account content
 */
docLoaded(() => {
  /** The input elements that make up the create account form. */
  const formInputs = {
    username : document.querySelector('input[name=\'username\']'),
    password : document.querySelector('input[name=\'password\']'),
    passwordVerify : document.querySelector('input[name=\'password-verify\']'),
    email : document.querySelector('input[name=\'email\']'),
    emailVerify : document.querySelector('input[name=\'email-verify\']'),
    companyName: document.querySelector('input[name=\'cName\']'),
    companyType: document.querySelector('input[name=\'bType\']'),
    firstName : document.querySelector('input[name=\'fName\']'),
    lastName : document.querySelector('input[name=\'lName\']'),
    phoneNum : document.querySelector('input[name=\'phoneNo\']'),
    locationStreet : document.querySelector('input[name=\'locationStreet\']'),
    locationCity : document.querySelector('input[name=\'locationCity\']'),
    locationCountry : document.querySelector('input[name=\'locationCountry\']'),
    description : document.querySelector('#description-block'),
    isAdmin: document.querySelector('input[name=\'isAdmin\'')
  };
  
  /**
   * Add a listener to store the field values and post them to the server 
   *     after clicking the submit button
   */
  document.querySelector('#create-submit').addEventListener('click', (e) => {
    e.preventDefault();
    //Check if the input fits the requirements before storing
    if (checkData(formInputs.password.value, formInputs.passwordVerify.value, formInputs.email.value, formInputs.emailVerify.value)) {
      let data = {
        username: formInputs.username.value,
        password: formInputs.password.value,
        fName: formInputs.firstName.value,
        lName: formInputs.lastName.value,
        cName: formInputs.companyName.value,
        bType: formInputs.companyType.value,
        email: formInputs.email.value,
        phoneNo: formInputs.phoneNum.value,
        locationStreet: formInputs.locationStreet.value,
        locationCity: formInputs.locationCity.value,
        locationCountry: formInputs.locationCountry.value,
        description: formInputs.description.value,
        isAdmin: formInputs.isAdmin.checked
      };
      sendData(data);
    }
  });

  /**
   * Add listener to each input to activate button on enter press.
   */
  document.querySelectorAll('.input').forEach((input) => {
    input.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) { // If key pressed is enter key
        document.querySelector('#create-submit').click();
      }
    });
  });
});

/**
 * checkData. Check that the password matches the specified pattern, that the email and email-verify are 
 * the same, and that the password and password-verify are the same.
 * @param {String} password - The password value
 * @param {String} passwordVerify - The password verfiy value
 * @param {String} email - The email value
 * @param {String} emailVerify - The email verify value
 * @returns true if the requirements are met, otherwise false
 */
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

/**
 * sendData. Sends information to a specified path and then 
 * either redirect or print an error message in response to that information.
 * @param {Object} data - the data to send to the server
 */
async function sendData(data) {
  try {
    let response = await fetch('/admin-add-account', {
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

/**
 * docLoaded. Runs a callback function when the web page is loaded.
 * @param {function} action - the function to run when the DOM is loaded.
 */
function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}
