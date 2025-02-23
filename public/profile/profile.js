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

        currFname = currFname || currentUser.fname;
        currLname = currLname || currentUser.lname;
        currDob = currDob || currentUser.dob;

        fname.value = currFname;
        lname.value = currLname;
        dob.value = currDob;

    } catch (error) {
        console.log(error);
    }

    fname.addEventListener('keyup', checkChange);
    lname.addEventListener('keyup', checkChange);
    dob.addEventListener('keyup', checkChange);

    saveChanges.addEventListener('click', updateUser);
    
})

/**
 * checks if all/any fields values are changed from their initial value. ALternates state of "save changes" button
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

// update user
/**
 * function to update user details.
 * calls server with new values for update.
 */
async function updateUser(){
    try {
        const response = await fetch('/updateUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // send updated detail(s) to server for update 
            body: JSON.stringify({
                fname: fname.value,
                lname: lname.value,
                dob: dob.value
            })
        });
        const data = await response.json();

        if (response.ok) {
            // update current values for user details 
            currFname = fname.value;
            currLname = lname.value;
            currDob = dob.value;

            // alert user and dispatch new event to reinitialise user info 
            window.alert(data.message);
            window.dispatchEvent(new Event('DOMContentLoaded'));
        } else {
            console.log(data.error);
        }

    } catch (error) {
        console.log('Error updating user:', error)
    }
}