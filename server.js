// importing required modules
require('dotenv').config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { loginUser, createUser, getUser, updateUser } = require('./server/auth/userAuth.js');

const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// setting up server
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 5050;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// function to verify token from firebase auth
async function verifyToken(req, res, next){
  const token = req.cookies['auth-token'];

  if(!token){
    console.log('Access denied, No token found!');
    res.redirect('/');
  }else{
    try{
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;

      res.cookie('auth-token', 
        token, 
        { 
          maxAge: 1800000, 
          httpOnly: true 
        }
      ); // refreshing auth token expiry time for timeout

      next();
    }catch(error){
      console.log('Access denied, Invalid token:', error.message);
      res.redirect('/');
    }
  }
}

// landing page for login/registeration
app.get("/", (req, res, next) => {
  const options = {
    root: path.join(__dirname, "."),
  };

  const fileName = "/public/landing/landing.html";
  return res.sendFile(path.join(__dirname, "public", "landing", "landing.html"), function (err) {
    err ? console.log(err) : console.log("Redirected Home");
  });
});


// login flow using firebase auth from /Login/login.js 
app.post('/login', async(req,res,next) => {
  const { email,password } = req.body;

  try {
    const user = await loginUser(email,password);
    const token = await user.getIdToken({forceRefresh: true}); //getting auth token from firebase

    res.cookie('auth-token', 
      token, 
      { 
        maxAge: 1800000, 
        httpOnly: true 
      }
    ); // setting cookie with token

    res.status(200).json({ 
      message: 'Login successful!', 
      user: user.uid 
    });
    
  } catch (error) {
    res.status(400).json({ message: 'Login unsuccessful!', error: error.message});
    console.log('Login failed[server side]:', error.message);
  }
});

// registeration flow using firebase auth from /server/auth/userAuth.js
app.post('/register', async(req,res) => {
  const { fname, lname, dob, email, password } = req.body;

  try {
    const newUser = await createUser({ fname, lname, dob, email, password });
    const token = await newUser.getIdToken({forceRefresh: true}); //getting auth token from firebase
    
    res.cookie('auth-token', 
      token, 
      { 
        maxAge: 1800000, 
        httpOnly: true 
      }
    ); // setting cookie with token

    res.status(200).json({ 
      message: 'Registeration succesful', 
      user: newUser.uid
    });

    console.log(newUser.uid, 'registered');
  } catch (error) {
    res.status(400).json({ message: 'User creation failed[server side]:', error: error.message });
    console.log('Registeration failed[server side]:', error.message);
  }
});

// get user details from firestore
app.get('/user', verifyToken, async(req,res) => {
  const uid = req.user.uid;

  try {
    const user = await getUser(uid);

    if(!user){
      return res.status(404).json({error: `user with uid ${uid} not found.`});
    }

    res.status(200).json(user);
    
  } catch (error) {
    console.log('Error getting user[server side]:', error.message);
    res.status(500).json({ error: error.message });
  }
})

// update user details 
app.put('/updateUser', verifyToken, async(req,res) =>{
  const uid = req.user.uid;
  const updatedData = {...req.body};

  try {
    await updateUser(uid, updatedData);
    res.status(200).json({ message: 'Profile updated succesfully!' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get('/logout', (req,res) => {
  try {
    res.cookie('auth-token', 
      '', 
      { 
        expires: new Date(0), 
        httpOnly: true,
        path: '/' 
      }
    );
    res.redirect('/');
  } catch (error) {
    console.log('Error logging out', error)
  }
})

// home page
app.get('/home', verifyToken, (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'home', 'home.html'));
});

// gallery page
app.get('/gallery', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery', 'gallery.html'));
});

// solar system
app.get('/gallery/solar-system', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery', 'solar-system', 'solar-system.html'));
});

app.get('/gallery/apod', verifyToken, (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery', 'apod', 'apod.html'));
})

app.get('/gallery/satellites', verifyToken, (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery', 'satellites', 'satellites.html'));
})

app.get('/games', verifyToken, (req,res) =>{
  res.sendFile(path.join(__dirname, 'public', 'games', 'games.html'));
})

app.get('/games/place-planets', verifyToken, (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'games', 'place-planets', 'place-planets.html'));
})

app.get('/games/saturn-says', verifyToken, (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'games', 'saturn-says', 'saturn-says.html'));
})

app.get('/profile', verifyToken, (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
})

app.get('/3d-galaxy', verifyToken, (req,res) => {
  res.sendFile(path.join(__dirname, 'public', '3d-galaxy', '3d-galaxy.html'));
})

app.get('/about', (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'about', 'about.html'));
})

app.get('/satelliteData/:id/:duration', async(req,res) =>{
  const n2yoKey = process.env.N2Y0_KEY;
  const { id, duration } = req.params;

  try {
    const response = await fetch(`https://api.n2yo.com/rest/v1/satellite/positions/${id}/0/0/0/${duration}/&apiKey=${n2yoKey}`);
    const data = await response.json();
    res.send(data);

  } catch (error) {
    console.error("Error fetching satellite data:", error);
    res.status(500).json({ error: "Failed to fetch satellite data" });
  }
})

if(process.env.NODE_ENV != "test"){
  app.listen(port, () => {
    console.log("Listening on " + port);
  });
}

module.exports = app;