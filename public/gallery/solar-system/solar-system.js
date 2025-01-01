const prev = document.getElementById('prev');
const next = document.getElementById('next');

const planet = document.getElementById('planet');
const planet_name = document.getElementById('planet-name');
const details = document.getElementById('details');
const stats = document.getElementById('statistics');
const fun_facts = document.getElementById('fun-facts');

const info_cont = document.querySelector('.info-container');
const info_title = document.getElementById('info-title');
const info_body = document.getElementById('info-body');
const close_btn = document.getElementById('close-btn');

const statMapping = {
    distance_from_sun_km: "Distance From Sun (km)",
    number_of_moons: "Number of Moons",
    average_surface_temperature_c: "Average Surface Temperature (°c)",
    radius_km: "Radius (km)",
    orbital_period_days: "Orbital Period (days)",
    rotation_period_hours: "Rotation Period (hours)"
}

let index = 0;
let planets_data = [];

loadData();

next.addEventListener('click', ()=>{
    index = Math.min(++index, 7);
    planet_name.innerText = planets_data.planets[index].name.toUpperCase();
    planet.style.background = `url("../../images/maps/${planets_data.planets[index].name}.jpg") repeat-x`;
})

prev.addEventListener('click', ()=>{
    index = Math.max(--index, 0);
    planet_name.innerText = planets_data.planets[index].name.toUpperCase();
    planet.style.background = `url("../../images/maps/${planets_data.planets[index].name}.jpg") repeat-x`;
})

details.addEventListener('click', ()=>{
    updateDetails(index);
    info_cont.classList.remove('hidden');
})

stats.addEventListener('click', ()=>{
    updateStats(index);
    info_cont.classList.remove('hidden');
})

fun_facts.addEventListener('click', ()=>{
    updateFacts(index);
    info_cont.classList.remove('hidden');
})

close_btn.addEventListener('click', ()=>{
    info_cont.classList.add('hidden');
})

function updateDetails(index){
    info_title.innerText = `${planets_data.planets[index].name} - Details`;

    removeElementsByClass('info-content');

    planets_data.planets[index].details.forEach(detail => {
        const p = document.createElement('p');

        p.classList.add('info-content');
        p.innerText = detail;
        info_body.appendChild(p);
    });
}

function updateStats(index){
    info_title.innerText = `${planets_data.planets[index].name} - Statistics`;

    removeElementsByClass('info-content');

    Object.entries(planets_data.planets[index].stats).forEach(([key, value]) => {
        const p = document.createElement('p');

        const statKey = statMapping[key] || key;
        p.innerText = `${statKey}: ${value.toLocaleString()}`;
        p.classList.add('info-content');
        info_body.appendChild(p);
    });

    console.log(planets_data.planets[index].stats.number_of_moons);
}

function updateFacts(index){
    info_title.innerText = `${planets_data.planets[index].name} - Fun Facts`;

    removeElementsByClass('info-content');

    planets_data.planets[index].fun_facts.forEach(fact => {
        const p = document.createElement('p');

        p.classList.add('info-content');
        p.innerText = fact;
        info_body.appendChild(p);
    });
}

function removeElementsByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => element.remove());
}

async function loadData(){
    try {
        const response = await fetch('/resources/planet-data.json');
        
        if(response.ok){
            planets_data = await response.json();
            planet.style.background = `url("../../images/maps/${planets_data.planets[0].name}.jpg") repeat-x`;
        }else{
            console.log('Fetch error', response.statusText);
        }
    } catch (error) {
        console.log('Error getting planet data', error);
    }
}