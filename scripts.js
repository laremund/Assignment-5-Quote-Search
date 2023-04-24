
// Array to hold all the quotes currently on the page, will fill with Quote objs
let currentQuotes = [[], []];

// Quote object to put inside currentQuotes (a bunch of instances of this)
class Quote {
    constructor (text, author) { // might wanna use rest syntax for author here
        this.text = text;
        this.author = author;
    }

    getQuote() {
        return [this.text, this.author]; // in an array so I can format it easier
    }
}

// Gets a random quote object from the API
async function getRandomQuote() {
    const result = await fetch("https://usu-quotes-mimic.vercel.app/api/random")
    .then(result => result.json());
    return result;
}

// Append any given quote to the expanding quote container
let appendQuote = (quoteObj) => {
    // Create a new div with the info from quoteObj
    let quoteHtml = ``;
    quoteHtml =
        `<div class="quote-container">
            <div class="quote">${quoteObj.getQuote()[0]}<br>- ${quoteObj.getQuote()[1]}</div>
        </div>`;
    let quotesContainer = document.getElementById('expanding-quote-container');
    let divQuote = document.createElement('div');
    divQuote.innerHTML = quoteHtml;
    // Add an event listener that pins a quote to the top of the list if clicked
        // My implementation of this uses an array with pinned quotes and one with
        // unpinned quotes
    divQuote.addEventListener('click', (e) => {
        let quote = divQuote.innerText;
        let quoteSeparate = quote.split('\n-');
        let quoteSearch = quoteSeparate[0];
        let newQuoteObj = null;
        for (i in currentQuotes[0]) {
            if (currentQuotes[0][i].text == quoteSearch) {
                currentQuotes[1].unshift(currentQuotes[0][i]);
                currentQuotes[0].splice(i, 1);
                newQuoteObj = null;
            }
        }
        for (i in currentQuotes[1]) {
            if (currentQuotes[1][i].text == quoteSearch) {
                newQuoteObj = currentQuotes[1][i];
                currentQuotes[1].splice(i, 1);
            }
        }
        if (newQuoteObj != null) {
            currentQuotes[0].push(newQuoteObj);
        }
    });
    // Append finished quote to the expanding-quote-container
    quotesContainer.append(divQuote);
}

// When page loads, get a random quote from the API and append it
addEventListener("load", (e) => {
    getRandomQuote().then((result) => {
        let newQuote = new Quote(result.content, result.author);
        currentQuotes[1].push(newQuote);
        appendQuote(newQuote);
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

    let body = document.body;
    let mainCont = document.getElementById('main-container');
    let expQuoteCont = document.getElementById('expanding-quote-container');
    
    mainCont.setAttribute('margin-top', 'none');
    expQuoteCont.innerHTML = `<div id="expanding-quote-container"></div>`;
    
    // If there are pinned quotes, append all of them first
    for (i in currentQuotes[0]) {
        appendQuote(currentQuotes[0][i]);
    }
    // Append all the unpinned quotes
    for (i in quoteObjects) {
        let quote = new Quote(quoteObjects[i].content, quoteObjects[i].author);
        currentQuotes[1].push(quote);
        appendQuote(quote);
    }
}

// When search icon is clicked, calls search() with input field content
let searchIcon = document.getElementById('search-icon');
let inputField = document.getElementById('author-name');
searchIcon.addEventListener('click', (e) => {
    search(inputField.value);
});

// let quotes = document.getElementsByClassName('quote-container');
// quotes.addEventListener('onmouseover', (e) => {
//     quotes.setAttribute('background-color', 'var(--cream)');
// });
