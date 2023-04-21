
// POJ to hold all the current quotes on the page, and to keep them in the
// order that I want
class Quote {
    constructor (text, author) { // might wanna use rest syntax for author here
        
    }
}

async function getRandomQuote() {
    const result = await fetch("https://usu-quotes-mimic.vercel.app/api/random")
    .then(result => result.json());
    return result;
}

// Append any given quote to the expanding quote container
let appendQuote = (quote, author, isRandom) => {
    let quoteHtml = ``;
    if (isRandom) {
        quoteHtml =
        `<div id="random-quote-container">
        <div class="quote">${quote} <br> &nbsp &nbsp - ${author}</div>
        </div>`;
    } else {
        quoteHtml =
        `<div class="quote-container">
        <div class="quote">${quote} <br> &nbsp &nbsp - ${author}</div>
        </div>`;
    }
    let quotesContainer = document.getElementById('expanding-quote-container');
    let divQuote = document.createElement('div');
    divQuote.innerHTML = quoteHtml;
    quotesContainer.append(divQuote);
}

// When page loads, get a random quote from the API and append it
addEventListener("load", (e) => {
    getRandomQuote().then((result) => {
        let quote = result.content;
        let author = result.author;
        appendQuote(quote, author, true);
    });
});

// Searches for given author and appends all quotes by that author
async function search(author) {
    let firstAndLast = author.split(' ');
    let firstName = firstAndLast[0];
    let lastName = firstAndLast[1];
    const result = await fetch('https://usu-quotes-mimic.vercel.app/api/search?query=' + firstName + ' ' + lastName);
    let jsonQuotes = await result.json();
    let quoteObjects = jsonQuotes.results;

    // let randomQuote = document.getElementById('random-quote-container');
    // randomQuote.remove();

    let body = document.body;
    let mainCont = document.getElementById('main-container');
    let expQuoteCont = document.getElementById('expanding-quote-container');
    mainCont.remove();
    expQuoteCont.remove();
    let mainContAfterLoad = document.createElement('div');
    mainContAfterLoad.innerHTML = 
        `<div id="main-container-results-loaded">
            <div id="quote-search">
                <h2>Quote Search</h2>
            </div>
            <div id="author-name-container">
                <input type="text" placeholder="John Cena" id="author-name">
                <i class="material-symbols-outlined" id="search-icon">search</i>
            </div>
        </div>`;
    let expQuoteContainerAfterLoad = document.createElement('div');
    expQuoteContainerAfterLoad.innerHTML = 
        `<div id="expanding-quote-container"></div>`;
    body.appendChild(mainContAfterLoad);
    body.appendChild(expQuoteContainerAfterLoad);

    for (i in quoteObjects) {
        let quote = quoteObjects[i].content;
        let author = quoteObjects[i].author;
        appendQuote(quote, author, false);
    }
}

// When search icon is clicked, calls search() with input field content
let searchIcon = document.getElementById('search-icon');
let inputField = document.getElementById('author-name');
searchIcon.addEventListener('click', (e) => {
    search(inputField.value);
})
