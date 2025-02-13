const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const dob = document.getElementById('dob');
const welcome = document.getElementById('welcome');

const saveChanges = document.getElementById('save');

let currentUser;

window.addEventListener('DOMContentLoaded', async() => {
    try {
        const response = await fetch('/user');
        currentUser = await response.json();

        welcome.innerText = `WELCOME, ${currentUser.fname.toUpperCase()}`;

        fname.value = currentUser.fname;
        lname.value = currentUser.lname;
        dob.value = currentUser.dob;
    } catch (error) {
        console.log(error);
    }
})