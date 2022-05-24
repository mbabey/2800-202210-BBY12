'use strict';
docLoaded(() => {
  sendName();
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

async function sendName() {
  try {
    let response = await fetch('/get-other-user?' + new URLSearchParams(window.location.search), {
      method: 'GET',
    });
    if (response.status == 200) {
      response = await response.text();
      response = JSON.parse(response);
      popThaSpots(response);
    }
  } catch (err) {
    console.log(err);
  }
}

function popThaSpots(data) {
  const biz_name = document.querySelectorAll('.business-name-block');
  const biz_owner_fName = document.querySelectorAll('.business-owner-fname-block');
  const biz_owner_lName = document.querySelectorAll('.business-owner-lname-block');
  const biz_type = document.querySelectorAll('.business-type-block');
  const biz_email = document.querySelectorAll('.business-email-block');
  const biz_phone = document.querySelectorAll('.business-phone-block');
  const biz_location = document.querySelectorAll('.business-location-block');
  const biz_description = document.querySelectorAll('.business-description-block');

  document.querySelector("#profile-picture").src = "./avatars/" + data[0].profilePic;
  biz_name.forEach((element) => {
    element.innerHTML = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
  });
  biz_owner_fName.forEach((element) => {
    element.innerHTML = (data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
  });
  biz_owner_lName.forEach((element) => {
    element.innerHTML = (data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
  });
  biz_type.forEach((element) => {
    element.innerHTML = (data[0].bType != undefined && data[0].bType != null) ? data[0].bType : '';
  });
  biz_email.forEach((element) => {
    element.innerHTML = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
  });
  biz_phone.forEach((element) => {
    element.innerHTML = (data[0].phoneNo != undefined && data[0].phoneNo != null) ? data[0].phoneNo : '';
  });
  biz_location.forEach((element) => {
    element.innerHTML = (data[0].location != undefined && data[0].location != null) ? data[0].location : '';
  });
  biz_description.forEach((element) => {
    element.innerHTML = (data[0].description != undefined && data[0].description != null) ? data[0].description : '';
  });
}
