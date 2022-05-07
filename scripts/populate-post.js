// // invoke ready and pass in a callback function
// ready(function () {

//     console.log("Client script loaded.");

//     function ajaxGET(url, callback) {

//         const xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//             if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
//                 //console.log('responseText:' + xhr.responseText);
//                 callback(this.responseText);

//             } else {
//                 console.log(this.status);
//             }
//         }
//         xhr.open("GET", url);
//         xhr.send();
//     }

//     function ajaxPOST(url, callback, data) {

//         let params = typeof data == 'string' ? data : Object.keys(data).map(
//             function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
//         ).join('&');
//         console.log("params in ajaxPOST", params);

//         const xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//             if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
//                 //console.log('responseText:' + xhr.responseText);
//                 callback(this.responseText);

//             } else {
//                 console.log(this.status);
//             }
//         }
//         xhr.open("POST", url);
//         xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xhr.send(params);
//     }
// });

// // process the callback function
// function ready(callback) {
//     if (document.readyState != "loading") {
//         callback();
//         console.log("ready state is 'complete'");
//     } else {
//         document.addEventListener("DOMContentLoaded", callback);
//         console.log("Listener was invoked");
//     }
// }