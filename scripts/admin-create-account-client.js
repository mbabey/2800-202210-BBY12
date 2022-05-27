'use strict';

/**
 * Loading the webpage and be ready to store the input values of create account content
 */
docLoaded(() => {
  /**
   * Storing form inputs into a constant
   * @param {Constant} formInputs The values of the form fields
   */
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
 * Checking the inputs for the requirements
 * @param {*} password The password value
 * @param {*} passwordVerify The password verfiy value
 * @param {*} email The email value
 * @param {*} emailVerify The email verify value
 * @returns false if the requirements are not met, otherwise true
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
 * Posting the form inputs to the server
 * @param {*} data The form inputs
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
 * Run the rest of the script when the web page is loaded
 * @param {*} action Run the actions on the script
 */
function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}
