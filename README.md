# Welcome to htmlScraper

A tool to extract data from HTML. Dependencies include Puppeteer with Rebrowser patches, User-Agents, and JSDOM.

## Installation

`npm i htmlscraper`

## Example Usage

Here is a basic example that demonstrates loading two different webpages. Each page's JSDOM instance is stored in an array property of the PageHTML class. We can then access these DOMs later with methods such as tables, links, and content.

### Basic Example:

```javascript
const PageHTML = require('htmlscraper');

// Create the PageHTML object.
let pHtml = new PageHTML();

(async () => {
    // Get the webpage content for two distinct URLs and store in the dom property of the PageHTML class.
    await pHtml.get('https://www.example.com');
    await pHtml.get('https://en.wikipedia.org/wiki/List_of_Formula_One_Grand_Prix_winners');

    // close the browser and page.
    pHtml.close();

    // Grab all href links from the example.com page.
    // This will return an array of link objects as shown below.
    // [
    //   {
    //     href: 'https://www.iana.org/domains/example',
    //     nodeName: 'a',
    //     outerHTML: '<a href="https://www.iana.org/domains/example">More information...</a>',
    //     innerHTML: 'More information...',
    //     parentElement: 'p'
    //   }
    // ]
    let links = pHtml.links(0);
    console.log(links);

    // prints to console: https://www.iana.org/domains/example
    let href = links[0].href;
    console.log(href);

    // From the wikipedia link, return the third table.
    // This will return the array of arrays listed below:
    // [
    //     [
    //         'Rank',
    //         'Country',
    //         'Driver',
    //         'Wins',
    //         'Seasons active',
    //         'First win',
    //         'Last win'
    //     ],
    //     [
    //         '1',
    //         'United Kingdom',
    //         'Lewis Hamilton†',
    //         '105',
    //         '2007–',
    //         '2007 Canadian Grand Prix',
    //         '2024 Belgian Grand Prix'
    //     ],
    //     [
    //         '2',
    //         'Germany',
    //         'Michael Schumacher‡',
    //         '91',
    //         '1991–2006, 2010–2012',
    //         '1992 Belgian Grand Prix',
    //         '2006 Chinese Grand Prix'
    //     ],
    //     [
    //         '3',
    //         'Netherlands',
    //         'Max Verstappen†',
    //         '63',
    //         '2015–',
    //         '2016 Spanish Grand Prix',
    //         '2024 Qatar Grand Prix'
    //     ],
    //     ...
    // ]
    let tables = pHtml.tables(1)[2];
    console.log(tables);
})();
```

### Passing a Referer:

In some cases it may be beneficial to pass a referer to the get method. This can be handled as follows:

```javascript
await pHtml.get('https://en.wikipedia.org/wiki/List_of_Formula_One_Grand_Prix_winners', 'https://en.wikipedia.org/');

```

## Handling Page Reroutes and Reloads

If you are interacting with the page to perform more browser automation beyond the scope of this API, you may find it advantagous to load the page, interact with it, and then grab the DOM of the page in its final state. This could be accomplished as follows:

```javascript
// Create the PageHTML object.
let pHtml = new PageHTML();

// load a webpage
await pHtml.get('https://bot-detector.rebrowser.net/');

// perform browser and page interactions using pHtml.browser and pHtml.page which exposes the puppeteer class.

// grab the latest dom after page interactions are complete by calling the get method with no arguments.
await pHtml.get();

```

## License
MIT

## Authors
John Glauber

## Contact
For any questions, comments, or suggestions please reach out via email to:

johnbglauber@gmail.com
https://github.com/jglauber/htmlScraper