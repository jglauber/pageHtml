"use strict";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const UserAgent = require('user-agents');
const puppeteer = require('rebrowser-puppeteer');
const makeTable = require('../utils/makeTable');
const getLinks = require('../utils/getLinks');
const getElement = require('../utils/getElement');

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

    /**
    * A function that retrieves data from a webpage.
    * @param {string|string[]} url 
    * @returns {object} The document object model (dom).
    */
    async get(url) {
        if (this.browser === null || this.page === null) {
            const browser = await puppeteer.launch({headless: false, defaultViewport: {width: this.screenWidth, height: this.screenHeight},
                args: ['--disable-blink-features=AutomationControlled'],
                ignoreDefaultArgs: ['--enable-automation']
            });
            const page = await browser.newPage();
            await page.evaluateOnNewDocument(() => {
                // delete navigator.__proto__.webdriver;
                // customize the navigator.platform value
                Object.defineProperty(navigator, "webdriver", {
                    get: () => false,
                });
                Object.defineProperty(navigator, "platform", {
                    value: this.platform,
                });
            });
            await page.setUserAgent(this.userAgent);
            this.browser = browser;
            this.page = page;
        }

        if (typeof(url) === "string") {
            await this.page.goto(url);
            var response = await this.page.content()
            var dom = new JSDOM(response);
            this.dom.push(dom);     
        } else if (Array.isArray(url)) {
            for (let site of url) {
                await this.page.goto(site);
                var response = await this.page.content()
                var dom = new JSDOM(response);
                this.dom.push(dom);
                await new Promise(resolve => setTimeout(resolve,Math.floor(Math.random() * 2000 + 2000)));
            }
        } else if (url === undefined) {
            var response = await this.page.content()
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
            content.push(getElement(dom,elementString));
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
