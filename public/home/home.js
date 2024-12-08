const news_cards = document.querySelectorAll(".card");

let news;

window.addEventListener('DOMContentLoaded', async ()=>{
    // await getNews();

    news_cards.forEach((card,index) => {
        // create nodes for image and news title
        const img = document.createElement('div');
        const title = document.createElement('div');
        const p = document.createElement('p');
        const a =  document.createElement('a');

        // add appropriate classes 
        img.classList.add("news-img");
        title.classList.add("news-title");

        // add news contents
        img.style.backgroundImage = `url(${news[index].image_url})`;
        p.textContent = `${news[index].title} - [${news[index].news_site}]`;
        p.style.padding = '5px';
        a.setAttribute('target', '_blank');
        a.href = `${news[index].url}`;
        
        // add image and title to card
        title.appendChild(p);

        a.appendChild(img);
        a.appendChild(title);

        card.appendChild(a);
    })
})


const getNews =  async() => {
    const time = Date.now(); //get current time
    const date = new Date(time - (86400000*3)).toISOString(); // covert to ISO8601 string and go back to previous day

    const baseUrl = 'https://api.spaceflightnewsapi.net/v4/articles/';
    const params = new URLSearchParams({
        limit: 10,
        published_at_gt: date
    });
    const fullUrl = `${baseUrl}?${params.toString()}`;

    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        if(response.ok){
            const res = await response.json();
            news = res.results;
            shuffleArray(news);
            console.log(news);
        }else{
            console.log("Error fetching news");
        }
    } catch (error) {
        console.log(error);
    }
}

function shuffleArray(array) {
    
    // Iterate over the array using for loop 
    for (let i = array.length - 1; i > 0; i--) {
    
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        
        // Swap elements at i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
}
