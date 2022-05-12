'use strict';

document.querySelector('#delete-admin').addEventListener("click", function (event) {
    let searchInput = { username: document.querySelector('#search-input').value }
    document.querySelector('#search-input').value = "";
    sendSearch(searchInput);
    event.preventDefault();
})

async function sendSearch(data) {
    try {
        await fetch('/search-user', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: data
        });
    } catch (err) {
        console.log(err);
    }
}


async function getUserData() {
    try {
        let response = await fetch('/admin-get-user', { method: 'GET' });
        if (response.status == 200) {
            let data = await response.text();
            popUserData(JSON.parse(data));
        }
    } catch (err) {

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
let location = document.querySelector('input[location]');
let description_block_block = document.querySelector('input[]');
let checkbox_block = document.querySelector('input[isAdmin]');
// let _block = document.querySelector('input[]');

function popUserData(data) {
    username_block.value = (data[0].username != undefined && data[0].username != null) ? data[0].username : '';
    email_block.value = (data[0].email != undefined && data[0].email != null) ? data[0].email : '';
    company_name_block.value = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
    biz_type_block.value = (data[0].cName != undefined && data[0].cName != null) ? data[0].cName : '';
    first_name_block.value =(data[0].fName != undefined && data[0].fName != null) ? data[0].fName : '';
    last_name_block.value =(data[0].lName != undefined && data[0].lName != null) ? data[0].lName : '';
    phone_num_block.value =(data[0].username != undefined && data[0].username != null) ? data[0].username : '';
    location.value =(data[0].username != undefined && data[0].username != null) ? data[0].username : '';
    description_block_block.value =(data[0].username != undefined && data[0].username != null) ? data[0].username : '';

}

function saved(data){
    
}

document.querySelector('#edit-submit').addEventListener("click", function(event){

    let username_sent = username_block.value;
    //verify
    let email_sent = email_block.value;
    let password_sent = password_block;

    let cName_sent = company_name_block.value;
    let biz_type_sent = biz_type_block.value;
    let fName_sent
    let lName_sent
    let 
})

