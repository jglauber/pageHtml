"use strict";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const UserAgent = require('user-agents');
const puppeteer = require('rebrowser-puppeteer');
const makeTable = require('../utils/makeTable');
const getLinks = require('../utils/getLinks');
const getElementText = require('../utils/getElement');

/**
 * 
 */
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

    clear() {
        this.dom.length = 0;
        return null;
    }

    tables() {
        var tables = [];
        for (let dom of this.dom) {
            tables.push(makeTable(dom));
        }
        return tables;
    }

    links() {
        var links = [];
        for (let dom of this.dom) {
            links.push(getLinks(dom));
        }
        return links;
    }

    content(elementString) {
        var content = [];
        for (let dom of this.dom) {
            content.push(getElementText(dom,elementString));
        }
        return content; 
    }

    close() {
        this.browser.close();
        this.page = null;
        this.browser = null;
    }
}; 

module.exports = PageHTML;
