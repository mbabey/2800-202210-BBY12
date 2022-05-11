function getAdmins() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

              let data = JSON.parse(this.responseText);
              if(data.status == "success") {

                let table = "<table><tr><th>Username</th></tr>";
                for(let i = 0; i < data.rows.length; i++) {
                    let row = data.rows[i];
                    table += "<tr><td>" + row.username + "</td></tr>";
                }
                table += "</table>";
                document.getElementById("admin-list").innerHTML = table;
            } else {
                console.log("Error!");
            }

        } else {

          // not a 200, could be anything (404, 500, etc.)
          console.log(this.status);

        }

    } else {
        console.log("ERROR", this.status);
    }
}
xhr.open("GET", "/get-admins");
xhr.send();
}
getAdmins();

document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

              getCustomers();
              document.getElementById("status").innerHTML = "All records deleted.";

            } else {

              // not a 200, could be anything (404, 500, etc.)
              console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/delete-admins");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
});
            