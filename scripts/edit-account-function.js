//populate the 'account-info' div dynamically
function getUser() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

              //what's this.reponseText referring to?  
              let data = JSON.parse(this.responseText);
              if(data.status == "success") {

                            let str = `        <h3>My Account</h3>`;


                    for(let i = 0; i < data.rows.length; i++) {
                        let row = data.rows[i];
                        //console.log("row", row);
                        str += ("<div class='first_name'><span>" + row.first_name
                            + "</span></div>" + "<div class='last_name'><span>" + row.last_name
                            + "</span></div>" + "<div class='email'><span>" + row.email 
                            + "</span></div>" + "<div class='password'><span>" 
                            + row.password + "</span></div>");
                    }
                    //console.log(str);
                    document.getElementsByClassName("account-info").innerHTML = str;

                    // select all spans under the email class of td elements
                    let first_name_records = document.querySelectorAll("div[class='first_name'] span");
                    for(let j = 0; j < first_name_records.length; j++) {
                        first_name_records[j].addEventListener("click", editCell);
                    }

                    let last_name_records = document.querySelectorAll("div[class='last_name'] span");
                    for(let j = 0; j < last_name_records.length; j++) {
                        last_name_records[j].addEventListener("click", editCell);
                    }

                    let email_records = document.querySelectorAll("div[class='email'] span");
                    for(let j = 0; j < email_records.length; j++) {
                        email_records[j].addEventListener("click", editCell);
                    }

                    let pswd_records = document.querySelectorAll("div[class='password'] span");
                    for(let j = 0; j < pswd_records.length; j++) {
                        pswd_records[j].addEventListener("click", editCell);
                    }

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
    xhr.open("GET", "/get-customers");
    xhr.send();
}
getCustomers();

//to edit the cells
function editCell(event) {

    // add a listener for clicking on the field to change info
    // span's text
    let spanText = event.target.innerHTML;
    // span's parent (div)
    let parent = event.target.parentNode;
    // create a new input, and add a key listener to it
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function(event) {
        let s = null;
        let v = null;
        // pressed enter
        if(event.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            // have to wire an event listener to the new element
            newSpan.addEventListener("click", editCell);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {id: parent.parentNode.querySelector(".id").innerHTML,
                              name: parent.parentNode.querySelector(".name").innerHTML,
                              email: v};

            // now send
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {

                    // 200 means everthing worked
                    if (xhr.status === 200) {
                      document.getElementById("status").innerHTML = "Record updated.";
                      getCustomers();


                    } else {

                      // not a 200, could be anything (404, 500, etc.)
                      console.log(this.status);

                    }

                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-customer");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //console.log("dataToSend", "id=" + dataToSend.id + "&email=" + dataToSend.email);
            xhr.send("id=" + dataToSend.id + "&email=" + dataToSend.email);

        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}


document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();

    let formData = { name: document.getElementById("name").value,
                     email: document.getElementById("email").value};
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";


    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

              getCustomers();
              document.getElementById("status").innerHTML = "DB updated.";

            } else {

              // not a 200, could be anything (404, 500, etc.)
              console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/add-customer");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("name=" + formData.name + "&email=" + formData.email);

})

document.getElementById("deleteAll").addEventListener("click", function(e) {
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
    xhr.open("POST", "/delete-all-customers");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
});






//        $(document).ready(function() {
//
//            function getCustomers() {
//                $.ajax({
//                    url: "/get-customers",
//                    dataType: "json",
//                    type: "GET",
//                    success: function(data) {
//                        console.log(data);
//                        let str = `        <tr>
//          <th class="id_header"><span>ID</span></th>
//          <th class="name_header"><span>Name</span></th>
//          <th class="email_header"><span>Email</span></th>
//        </tr>`;
//                        for(let i = 0; i < data.rows.length; i++) {
//                            let row = data.rows[i];
//                            //console.log("row", row);
//                            str += ("<tr><td class='id'>" + row.ID
//                                + "</td><td>" + row.name
//                                + "</td><td class='email'><span>"
//                                + row.email + "</span></td></tr>");
//                        }
//                        //console.log(str);
//                        $("#customers").html(str);
//
//                    },
//                    error: function(jqXHR, textStatus, errorThrown) {
//                        $("#p2").text(jqXHR.statusText);
//                        console.log("ERROR:", jqXHR, textStatus, errorThrown);
//                    }
//
//                });
//            }
//            getCustomers();
//
//
//            $('#submit').click(function(e) {
//                e.preventDefault();
//
//                let formData = { name: $("#name").val(),
//                                 email: $("#email").val()
//                               };
//                $("#name").val("");
//                $("#email").val("");
//
//                $.ajax({
//                    url: "/add-customer",
//                    dataType: "json",
//                    type: "POST",
//                    data: formData,
//                    success: function(data) {
//                        //console.log(data);
//                        $("#status").html("DB updated.");
//                        getCustomers();
//                    },
//                    error: function(jqXHR, textStatus, errorThrown) {
//                        $("#p2").text(jqXHR.statusText);
//                        console.log("ERROR:", jqXHR, textStatus, errorThrown);
//                    }
//
//                });
//            });
//
//            $('#deleteAll').click(function(e) {
//                e.preventDefault();
//
//                $.ajax({
//                    url: "/delete-all-customers",
//                    dataType: "json",
//                    type: "POST",
//                    success: function(data) {
//                        console.log(data);
//                        $("#status").html("All records deleted.");
//                        getCustomers();
//                    },
//                    error: function(jqXHR, textStatus, errorThrown) {
//                        $("#p2").text(jqXHR.statusText);
//                        console.log("ERROR:", jqXHR, textStatus, errorThrown);
//                    }
//
//                });
//            });
//
//            // http://stackoverflow.com/questions/11882693/change-table-cell-from-span-to-input-on-click
//            $('#customers').on('click', 'span', function() {
//
//                //console.log($(this).parent().attr('class'));
//                if($(this).parent().attr('class') === 'email') {
//                    //console.log($(this).text() );
//                    // got the td, let's use it create a slight-of-hand
//                    // create an input, put the text from the span into
//                    // the input, then when the user presses enter,
//                    // take the updated text from input and put it into a span
//                    // and remove the input
//                    let spanText = $(this).text();
//                    let td = $(this).parent();
//                    let input = $("<input type='text' value='" + spanText + "'>");
//
//                    td.html(input);
//                    //console.log(td.html());
//                    $(input).keyup(function(e) {
//                        let val = null;
//                        let span = null;
//                        //  13 == return key on the keyboard
//                        if(e.which == 13) {
//                              //console.log(td);
//                            val = $(input).val();
//                            span = $("<span>" + val + "</span>");
//                            td.html(span);
//                            // lastly, send the update:
//
//                            //console.log(td.parent().find("[class='id']")[0]);
//
//                            let dataToSend = {
//                                id: td.parent().find("[class='id']").html(),
//                                email: val
//                                           };
//                            //console.log(dataToSend);
//                            $.ajax({
//                                url: "/update-customer",
//                                dataType: "json",
//                                type: "POST",
//                                data: dataToSend,
//                                success: function(data) {
//                                    //console.log(data);
//                                    $("#status").html("DB updated.");
//                                    getCustomers();
//                                },
//                                error: function(jqXHR, textStatus, errorThrown) {
//                                    $("#p2").text(jqXHR.statusText);
//                                    console.log("ERROR:", jqXHR, textStatus, errorThrown);
//                                }
//                            });
//                        }
//                    });
//                }
//
//            });
//
//
//        });