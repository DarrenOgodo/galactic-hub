const planet_names = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
const boxes = document.querySelectorAll('.box');


//generate spheres (planets)
window.addEventListener('load', (e) => {
    const planets_container = document.querySelector('.planets-container');
    planets_container.replaceChildren();
    shuffleArray(planet_names);

    for(let i=0; i<planet_names.length; i++){
        let new_planet = document.createElement('div');
        new_planet.setAttribute('title', planet_names[i]);
        new_planet.setAttribute('draggable', 'true');
        new_planet.setAttribute('id', planet_names[i]);
        new_planet.style.backgroundImage = `url("../../images/maps/${planet_names[i]}.jpg")`; // replace with path to each planet skin Map
        new_planet.classList.add('planet');

        new_planet.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('planet_name', new_planet.getAttribute('title'));
        });

        planets_container.appendChild(new_planet);
    }
});


boxes.forEach((box) => {
    box.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    box.addEventListener('drop', (e) => {
        const planet_name = e.dataTransfer.getData('planet_name');
        const planet = document.querySelector(`[title="${planet_name}"]`);

        if (box.childElementCount > 0) {
            const old_planet = box.firstChild;
            document.querySelector('.planets-container').appendChild(old_planet);
            box.classList.remove('hovered');
            box.appendChild(planet);	
        }else{
            box.appendChild(planet);
            box.classList.remove('hovered');
        }

        // Check completion after drop
        if (checkCompletion()) {
            const incorrectPlanets = validatePlacement();

            if (incorrectPlanets.length === 0) {
                showMessage("✅ Correct! All planets are placed correctly!");
            } else {
                showMessage(`❌ ${incorrectPlanets.join(', ')} are out of position. Try again!`);
            }
        }
    })

    box.addEventListener('dragenter', () => {
        box.classList.add('hovered');
    })
    box.addEventListener('dragleave', () => {
        box.classList.remove('hovered');
    })

})

function checkCompletion() {
    const boxes = document.querySelectorAll('.box');
    let allPlaced = true;

    boxes.forEach((box) => {
        if (box.childElementCount === 0) {
            allPlaced = false; // If any box is empty, game is not complete
        }
    });

    return allPlaced;
}

function validatePlacement() {
    let incorrectPlanets = [];
    const boxes = document.querySelectorAll('.box');

    boxes.forEach((box) => {
        if (box.childElementCount > 0) {
            const placedPlanet = box.firstChild.id;
            const correctPlanet = box.getAttribute('data-planet');
            
            if (placedPlanet !== correctPlanet) {
                incorrectPlanets.push(placedPlanet);
            }
        }
    });

    return incorrectPlanets; // Return an array of incorrectly placed planets
}

function showMessage(message) {
    const dialog = document.getElementById('messageDialog');
    document.getElementById('dialogText').textContent = message;
    dialog.showModal();
}

function closeDialog() {
    document.getElementById('messageDialog').close();
}

// reset game 
document.getElementById('resetButton').addEventListener('click', () => {
    document.querySelector('.planets-container').replaceChildren();
    boxes.forEach((box) => box.innerHTML = ""); // Clear boxes
    window.dispatchEvent(new Event('load')); // Reload planets
    document.getElementById('messageDialog').close();
});


function shuffleArray(array) {
    
    // Iterate over the array using for loop 
    for (let i = array.length - 1; i > 0; i--) {
    
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        
        // Swap elements at i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
}