'use strict';

docLoaded(() => {
  async function getLoginData() {
    try {
      let response = await fetch('/login', {
        method: 'GET'
      });
      if (response.status == 200) {
        let data = await response.text();
        popUserData(JSON.parse(data));
      }
    } catch (err) {
      throw "Cannot get login.";
    }
  }
});
getLoginData();

  function popUserData(data) {
    document.getElementById("submit").addEventListener("click", (e) => {
      if (response.status === 200) {
        document.getElementById("error-message").innerHTML = "Login success.";
      } else {
        document.getElementById("error-message").innerHTML = "Account doesn't exist!";
      }
    });
  }