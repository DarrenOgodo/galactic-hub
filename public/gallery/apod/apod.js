const date_picker = document.getElementById('date-picker');

// search elements 
const button = document.getElementById('search-btn');
const buttonText = button.querySelector('.button-text');
const loader = button.querySelector('.loader');

// image elements 
const image_cont = document.getElementById('image-cont');
const title = document.getElementById('image-title');
const image = document.getElementById('image');
const video = document.getElementById('video');
const alt = document.getElementById('alt-display');
const description = document.getElementById('image-desc');


button.addEventListener('click', async() => {
    // replace button text with loader
    buttonText.style.display = 'none';
    loader.style.display = 'inline-block';
    button.disabled = true;
    image_cont.style.display = 'none';

    // Get today's date and selected date
    const today = new Date(); // Current date
    const selectedDate = new Date(date_picker.value); // User-selected date

    // Ensure selected date is valid and no later than today
    if (selectedDate > today) {
        alert("The selected date cannot be in the future. Please choose a valid date.");
        loader.style.display = 'none';
        buttonText.style.display = 'inline-block';
        button.disabled = false;
        return;
    }

    // get APOD 
    await getAPOD(date_picker.value);

    // set loader off
    buttonText.style.display = 'inline-block';
    loader.style.display = 'none';
    button.disabled = false;
});

/**
 * Function to display APOD on the page
 ** Checks for @type "Image", "Video", and Other
 * @param {JSON} APOD 
 */
function displayAPOD(apod){
    if(apod.media_type == "image"){
        // display image and hide others
        image_cont.style.display = 'flex';
        video.style.display = 'none';
        alt.style.display = 'none';
        image.style.display = 'block';

        title.innerText = `${apod.title} (${apod.date})`
        image.src = apod.hdurl;
        image.alt = apod.title;
        image.title = apod.title;
        description.innerText = apod.explanation;

    }else if(apod.media_type == "video"){
        // display video iframe and hide others
        image_cont.style.display = 'flex';
        video.style.display = 'block';
        alt.style.display = 'none';
        image.style.display = 'none';

        title.innerText = `${apod.title} (${apod.date})`
        video.src = apod.url;
        description.innerText = apod.explanation;

    }else{
        // display alt and hide others
        image_cont.style.display = 'flex';
        video.style.display = 'none';
        alt.style.display = 'block';
        image.style.display = 'none';

        title.innerText = `${apod.title} (${apod.date})`
        alt.innerText = apod.url;
        description.innerText = apod.explanation;
    }
}

/**
 * Function to get Astronomy Picture of The Day from NASA API
 * @param {Date} date 
 * @returns JSON containing data about APOD
 */
async function getAPOD(date) {
    // search params for apod api
    const params = new URLSearchParams({
        api_key: "DEMO_KEY",
        date: date
    });
    const url = `https://api.nasa.gov/planetary/apod?${params.toString()}`;

    // getting data
    try {
        const response = await fetch(url);
        
        if (response.ok) {
            const res =  await response.json();
            displayAPOD(res);
        } else {
            console.log("Error", response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
    
}