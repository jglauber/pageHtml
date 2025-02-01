"use strict";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const UserAgent = require('user-agents');
const puppeteer = require('rebrowser-puppeteer');
const makeTable = require('../utils/makeTable');
const getLinks = require('../utils/getLinks');

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
    };

    /**
    * A function that retrieves data from a webpage.
    * @param {string|string[]} url 
    * @returns {object} The document object model (dom).
    */
    async get(url) {
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
        if (typeof(url) === "string") {
            await page.goto(url);
            var response = await page.content()
            var dom = new JSDOM(response);
            this.dom.push(dom);     
        } else if (Array.isArray(url)) {
            for (let site of url) {
                await page.goto(site);
                var response = await page.content()
                var dom = new JSDOM(response);
                this.dom.push(dom);
                await new Promise(resolve => setTimeout(resolve,Math.floor(Math.random() * 2000 + 2000)));
            }
        }
        // browser.close()
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
};

// 

module.exports = PageHTML;
