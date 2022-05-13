'use strict';

document.querySelector('#search-user').addEventListener("click", function (event) {
  let searchInput = {
    username: document.querySelector('#search-input').value
  }
  document.querySelector('#search-input').value = "";
  sendSearch(searchInput);
  event.preventDefault();
})

async function sendSearch(data) {
  try {
    await fetch('/search-user', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: data
    });
  } catch (err) {
    if (err) throw err;
  }
}

async function getUserData() {
  try {
    let response = await fetch('/admin-get-user', {
      method: 'GET'
    });
    if (response.status == 200) {
      let data = await response.text();
      popUserData(JSON.parse(data));
    }
  } catch (err) {
    if (err) throw err;
  }
}
getUserData();

let username_block = document.querySelector('input[username]');
let email_block = document.querySelector('input[email]');
let email_verify_block = document.querySelector('input[email-verify]');
let password_block = document.querySelector('input[password]');
let password_verify_block = document.querySelector('input[password-verify]');
let company_name_block = document.querySelector('input[company-name]');
let biz_type_block = document.querySelector('input[biz-type]');
let first_name_block = document.querySelector('input[first-name]');
let last_name_block = document.querySelector('input[last-name]');
let phone_num_block = document.querySelector('input[phone-num]');
let location_block = document.querySelector('input[location]');
let description_block = document.querySelector('input[]');
let checkbox_block = document.querySelector('input[isAdmin]');
let edit_password = false;

function popUserData(data) {
  username_block.value = (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
  email_block.value = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
  company_name_block.value = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
  biz_type_block.value = (data[0].bType != undefined && data[0].bType != null) ? data[0].bType : '';
  first_name_block.value = (data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
  last_name_block.value = (data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
  phone_num_block.value = (data[0].phoneNo != undefined && data[0].phoneNo != null) ? data[0].phoneNo : '';
  location_block.value = (data[0].location != undefined && data[0].location != null) ? data[0].location : '';
  description_block.value = (data[0].description != undefined && data[0].description != null) ? data[0].description : '';
}

let username_block_ori = username_block.value;
let email_block_ori = email_block.value;
let company_name_block_ori = company_name_block.value;
let biz_type_block_ori = biz_type_block.value;
let first_name_block_ori = first_name_block.value;
let last_name_block_ori = last_name_block.value;
let phone_num_block_ori = phone_num_block.value;
let location_block_ori = location_block.value;
let description_block_ori = description_block.value;

function verifySame(data1, data2) {
  return data1 == data2;
}

function checkEmpty(data) {
  let checkEmpty = data.trim();
  let checkSpace = data.replace('/&nbsp;/g', '');
  let checkEnter = data.replace('/<div><br></div>/g', '');

  if (checkEmpty == '' || checkSpace.trim() == '' || checkEnter.trim() == '') {
    return false;
  } else {
    return true;
  }
};

document.querySelector('#edit-submit').addEventListener("click", function (event) {

  let username_sent = username_block.value;
  if (!checkEmpty(username_sent)) {
    username_sent = username_block_ori;
  };

  if (verifySame(email_block.value, email_verify_block)) {
    let email_sent = email_block.value;
    if (!checkEmpty(email_sent)) {
      username_sent = username_block_ori;
    };
  } else {
    alert("Please verify both fields in the email."); //or update msg
    email_sent = email_block_ori;
  }

  let cName_sent = company_name_block.value;
  if (!checkEmpty(cName_sent)) {
    cName_sent = company_name_block_ori;
  };

  let biz_type_sent = biz_type_block.value;
  if (!checkEmpty(biz_type_sent)) {
    biz_type_sent = biz_type_block_ori;
  };

  let fName_sent = first_name_block.value;
  if (!checkEmpty(fName_sent)) {
    fName_sent = first_name_block_ori;
  };

  let lName_sent = last_name_block.value;
  if (!checkEmpty(lName_sent)) {
    lName_sent = last_name_block_ori;
  };

  let phoneNo_sent = phone_num_block.value;
  if (!checkEmpty(phoneNo_sent)) {
    phoneNo_sent = phone_num_block_ori;
  };

  let location_sent = location.value;
  if (!checkEmpty(location_sent)) {
    location_sent = location_block_ori;
  };

  let description_sent = description_block.value;
  if (!checkEmpty(description_sent)) {
    description_sent = description_block_ori;
  };

  let dataToSend = {
    username: username_sent,
    email: email_sent,
    cName: cName_sent,
    bType: biz_type_sent,
    fName: fName_sent,
    lName: lName_sent,
    phoneNo: phoneNo_sent,
    location: location_sent,
    description: description_sent
  };
  sendData(JSON.stringify(dataToSend));
  //update message
});

async function sendData(data) {
  try {
    await fetch('/admin-edit-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
  } catch (err) {
    if (err) throw err;
  }
}

async function sendPswd(data) {
  try {
    await fetch('/admin-edit-user-pswd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
  } catch (err) {
    if (err) throw err;
  }
}