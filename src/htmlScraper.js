"use strict";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const UserAgent = require('user-agents');
const puppeteer = require('rebrowser-puppeteer');
const makeTable = require('../utils/makeTable');
const getLinks = require('../utils/getLinks');
const getElementText = require('../utils/getElement');

/** A class representing HTML pages. */
class PageHTML {
    constructor() {
        this.dom = [];
        this.userAgentObject = new UserAgent({deviceCategory: 'desktop'});
        this.userAgent = this.userAgentObject.data.userAgent.toString();
        this.screenWidth = this.userAgentObject.data.screenWidth;
        this.screenHeight = this.userAgentObject.data.screenHeight;
        this.platform = this.userAgentObject.data.platform;
        this.page = null;
        this.browser = null;
    };

    /**
     * A private method to generate the browser and page instances.
     * @returns {{browser, page}} browser and page object, elements of Puppeteer class.
     */
    async #createPage() {
        if (this.browser === null || this.page === null) {
            const browser = await puppeteer.launch({headless: false, defaultViewport: {width: this.screenWidth, height: this.screenHeight},
                ignoreDefaultArgs: ['--enable-automation'],
                args: ['--disable-blink-features=AutomationControlled'],
            });
            const page = await browser.newPage();
            await page.setUserAgent(this.userAgent);
            this.browser = browser;
            this.page = page;
            return {browser: browser, page: page};
        }
        return {browser: this.browser, page: this.page};
    }

    /**
    * A function that retrieves data from a webpage.
    * @param {string} url The target url from which to grab data.
    * @returns {jsdom.JSDOM} The document object model (dom).
    */
    async get(url, referer) {
        const pageObject = await this.#createPage();
        const page = pageObject.page;

        if (typeof(url) === "string") {
            await page.goto(url, {referer: referer});
            var response = await page.content()
            var dom = new JSDOM(response);
            this.dom.push(dom);     
        } else if (url === undefined) {
            var response = await page.content()
            var dom = new JSDOM(response);
            this.dom.push(dom);
        }
        return this.dom;
    }

    /**
     * A method to clear the array of the dom property of the class.
     * @returns {null}
     */
    clear() {
        this.dom.length = 0;
        return null;
    }

    /**
     * A method to return all tables present in an instance of the JSDOM class.
     * @param {number} index The index of the dom property to perform this method on.
     * This may be a single number or an array of numbers. If left undefined it will apply to all indexes.
     * @returns {string[]} an array of arrays representing rows and columns of an html table.
     * @example
     * ```javascript
     * 
     * // create the PageHTML class.
     * let pHtml = new PageHTML();
     * 
     * // grab the webpage content.
     * await pHtml.get('https://en.wikipedia.org/wiki/List_of_Formula_One_Grand_Prix_winners');
     * 
     * // close the webpage.
     * pHtml.close();
     * 
     * // setting index to 0 returns the tables for the 0th JSDOM element in the pHtml.dom property.
     * // additionally we set the array index to 1 to confirm we only want the second table.
     * let links = pHtml.tables(0)[1];
     * console.log(tables);
     * ```
     * returns the second html table from the webpage as an array of arrays.
     */
    tables(index) {
        if (index === undefined) {
            var tables = [];
            for (let dom of this.dom) {
                tables.push(makeTable(dom));
            }
            return tables;
        } else if (typeof(index) === 'number') {
            try {
                return makeTable(this.dom[index]);
            } catch (error) {
                if (error instanceof TypeError) {
                    console.log(`Invalid Index: There is no JSDOM at index ${index}.`);
                } else {
                    // All other errors.
                    console.error("Error:", error.message);
                }
            }
        } else if (Array.isArray(index)) {
            var tables = [];
            for (let i of index) {
                try {
                    tables.push(makeTable(this.dom[i]));            
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.log(`Invalid Index: There is no JSDOM at index ${i}.`);
                        break;
                    } else {
                        // All other errors.
                        console.error("Error:", error.message);
                    }          
                }            
            }
            return tables; 
        }
    }

    /**
     * A method that returns a links object containing relevant information to any href elements in the instance of a JSDOM class.
     * @param {number} index The index of the dom property to perform this method on.
     * This may be a single number or an array of numbers. If left undefined it will apply to all indexes.
     * @returns {Array.<{href: string,
     * nodeName: string,
     * outerHTML: string,
     * innerHTML: string,
     * parentElement: string}>} an array of link objects.
     * 
     * @example
     * ```javascript
     * 
     * // create the PageHTML class.
     * let pHtml = new PageHTML();
     * 
     * // grab the webpage content.
     * await pHtml.get('https://en.wikipedia.org/wiki/List_of_Formula_One_Grand_Prix_winners');
     * 
     * // close the webpage.
     * pHtml.close();
     * 
     * // setting index to 0 returns the link objects for the 0th JSDOM element in the pHtml.dom property.
     * // additionally we set the array index to 2 to confirm we only want the third link.
     * let links = pHtml.links(0)[2];
     * console.log(tables);
     * ```
     * returns the third href link from the webpage as a link object.
     */
    links(index) {
        if (index === undefined) {
            var links = [];
            for (let dom of this.dom) {
                links.push(getLinks(dom));
            }
            return links; 
        } else if (typeof(index) === 'number') {
            try {
                return getLinks(this.dom[index]);
            } catch (error) {
                if (error instanceof TypeError) {
                    console.log(`Invalid Index: There is no JSDOM at index ${index}.`);
                } else {
                    // All other errors.
                    console.error("Error:", error.message);
                }
            }
        } else if (Array.isArray(index)) {
            var links = [];
            for (let i of index) {
                try {
                    links.push(getLinks(this.dom[i]));            
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.log(`Invalid Index: There is no JSDOM at index ${i}.`);
                        break;
                    } else {
                        // All other errors.
                        console.error("Error:", error.message);
                    }          
                }            
            }
            return links; 
        }
    }

    /**
     * A method that returns a content object containing the text content
     * and other relevant parameters for an HTML element.
     * @param {number|number[]} index The index of the dom property to perform this method on.
     * This may be a single number or an array of numbers. If left undefined it will apply to all indexes.
     * @param {string} elementString 
     * @returns {Array.<{elementText: string,
     * nodeName: string,
     * outerHTML: string,
     * innerHTML: string,
     * parentElement: string}>} an array of element objects.
     * 
     * @example
     * ```javascript
     * // create the PageHTML class.
     * let pHtml = new PageHTML();
     * 
     * // load the webpage.
     * await pHtml.get('https://www.whatsmyua.info/');
     * 
     * // close the connection.
     * pHtml.close();
     * 
     * // return the list element with id rawUa.
     * // setting index to 0 returns the 0th JSDOM element in the pHtml.dom property.
     * // additionally we set the array index to 0 to confirm we only want the first instance.
     * let userAgentDetected = pHtml.content('li#rawUa',0)[0];
     * 
     * console.log(userAgentDetected);
     * ```
     * returns the string user agent detected by www.whatsmyua.info
     */
    content(elementString, index) {
        if (index === undefined) {
            var content = [];
            for (let dom of this.dom) {
                content.push(getElementText(dom,elementString));
            }
            return content; 
        } else if (typeof(index) === 'number') {
            try {
                return getElementText(this.dom[index], elementString);
            } catch (error) {
                if (error instanceof TypeError) {
                    console.log(`Invalid Index: There is no JSDOM at index ${index}.`);
                } else {
                    // All other errors.
                    console.error("Error:", error.message);
                }
            }
        } else if (Array.isArray(index)) {
            var content = [];
            for (let i of index) {
                try {
                    content.push(getElementText(this.dom[i],elementString));           
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.log(`Invalid Index: There is no JSDOM at index ${i}.`);
                        break;
                    } else {
                        // All other errors.
                        console.error("Error:", error.message);
                    }          
                }            
            }
            return content;  
        }        
    }

    /**
     * Closes the browser instance of Puppeteer and sets the page and browser properties of the PageHTML class to null.
     */
    close() {
        this.browser.close();
        this.page = null;
        this.browser = null;
    }
}; 

module.exports = PageHTML;
