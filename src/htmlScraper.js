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
    * @param {string} url 
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
     * @returns {string[]} tables: an array of arrays representing rows and columns of an html table.
     */
    tables() {
        var tables = [];
        for (let dom of this.dom) {
            tables.push(makeTable(dom));
        }
        return tables;
    }

    /**
     * A method that returns a links object containing relevant information to any href elements in the instance of a JSDOM class.
     * @returns {Array.<{href: string,
     * nodeName: string,
     * outerHTML: string,
     * innerHTML: string,
     * parentElement: string}>}
     */
    links() {
        var links = [];
        for (let dom of this.dom) {
            links.push(getLinks(dom));
        }
        return links;
    }

    /**
     * 
     * @param {string} elementString 
     * @returns {Array.<{elementText: string,
     * nodeName: string,
     * outerHTML: string,
     * innerHTML: string,
     * parentElement: string}>}
     */
    content(elementString) {
        var content = [];
        for (let dom of this.dom) {
            content.push(getElementText(dom,elementString));
        }
        return content; 
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
