const userDet = document.getElementById('userDet');
const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const dob = document.getElementById('dob');
const welcome = document.getElementById('welcome');

const saveChanges = document.getElementById('save');

let currentUser, currFname, currLname, currDob;

window.addEventListener('DOMContentLoaded', async() => {
    try {
        const response = await fetch('/user');
        currentUser = await response.json();

        welcome.innerText = `WELCOME, ${currentUser.fname.toUpperCase()}`;

        currFname = currentUser.fname;
        currLname = currentUser.lname;
        currDob = currentUser.dob;

        fname.value = currFname;
        lname.value = currLname;
        dob.value = currDob;

    } catch (error) {
        console.log(error);
    }

    fname.addEventListener('change', checkChange);
    lname.addEventListener('change', checkChange);
    dob.addEventListener('change', checkChange);

    saveChanges.addEventListener('click', updateUser);
    
})

/**
 * checks if all/any fields values are changed from their initial value
 * @returns true if any are changed and false otherwise.
*/
function checkChange(event){
    const{ id, value } = event.target;

    if((id === 'fname' && value !== currFname) ||
    (id === 'lname' && value !== currLname) ||
    (id === 'dob' && value !== currDob)){
        saveChanges.disabled = false;
    }else{
        saveChanges.disabled = true;
    }
}

async function updateUser(){
    
    const updatedData = {
        fname: fname.value,
        lname: lname.value,
        dob: dob.value
    }

    try {
        const response = await fetch('/updateUser', {
            method: 'PUT',
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            
        } else {
            console.log(await response.json().error);
        }

    } catch (error) {
        console.log('Error updating user:', error)
    }
}