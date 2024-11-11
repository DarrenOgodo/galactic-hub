// Client side handling for login and registration forms so i can handle operations better and more efficiently, e.g displaying alerts, changing button states, etc.

// preventing default submission and handling form data using fetch api for login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });

        // navigate to home page after login
        if(response.ok){
            window.location.href = '/home';
        }else{
            const res = await response.json();
            console.log('Login unsuccessful:', res.error);
            displayCustomError('Login unsuccessful: '+ checkError(res.error));
        }
    } catch (error) {
        console.error('Login Error:', error);
        displayCustomError(error.message);
    }    
});

// preventing default submission and handling form data using fetch api for account creation
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const dob = document.getElementById('dob').value;
    const signupEmail = document.getElementById('signupEmail').value;
    const signupPassword = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                fname: fname, 
                lname: lname, 
                dob: dob, 
                email: signupEmail, 
                password: signupPassword })
        })
    
        // navigate to home page after registeration and login
        if(response.ok){
            window.location.href = '/home';
        }else{
            const res = await response.json();
            console.log('Registration unsuccessful', res.error);
            displayCustomError('Registration unsuccessful: '+ checkError(res.error));
        }
    } catch (error) {
        console.error('Registration Error:', error);
        displayCustomError(error.message);
    }
});

// function to use customError function to display error messages from firebase auth
function displayCustomError(error){
    document.getElementsByClassName('error-container')[0].classList.remove('hidden');
    document.getElementsByClassName('error-content')[0].innerHTML = error;
}

document.getElementsByClassName('fa-x')[0].addEventListener('click', function(){
    document.getElementsByClassName('error-container')[0].classList.add('hidden');
});

// toggle login and registration forms
function showLogin() {
    // Show login form, hide registration form
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("registerForm").classList.remove("active");
    
    // Update button states
    document.getElementById("loginBtn").classList.add("active");
    document.getElementById("registerBtn").classList.remove("active");
}

function showRegister() {
    // Show registration form, hide login form
    document.getElementById("registerForm").classList.add("active");
    document.getElementById("loginForm").classList.remove("active");
    
    // Update button states
    document.getElementById("registerBtn").classList.add("active");
    document.getElementById("loginBtn").classList.remove("active");
}

// alert with specific error from firebase auth error docs https://firebase.google.com/docs/auth/admin/errors
function checkError(error){
    if(error.includes('auth/email-already-in-use')){
        return 'Email already in use.';
    }else if(error.includes('auth/invalid-email')){
        return 'Invalid email.';
    }else if(error.includes('auth/weak-password')){
        return 'Weak password.';
    }else if(error.includes('auth/user-not-found')){
        return 'User not found.';
    }else if(error.includes('auth/wrong-password')){
        return 'Incorrect password.';
    }else if(error.includes('auth/invalid-credential')){
        return 'Invalid credentials';
    }else{
        return error;
    }
}
