# Welcome to htmlScraper

A tool to extract data from HTML. Dependencies include Puppeteer with Rebrowser patches, User-Agents, and JSDOM.

## Installation

`npm i htmlScraper`

## Example Usage

```javascript
const PageHTML = require('./src/htmlScraper')

// Create the PageHTML object.
let pHtml = new PageHTML();

// Get the webpage content.
await pHtml.get(['http://www.example.com/'])

// Grab any html tables on the page.
let tables = pHtml.tables()

// Grab all href links on the page.
let links = pHtml.links()
```

## License
MIT

## Authors
John Glauber