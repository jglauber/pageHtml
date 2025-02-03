const PageHTML = require('../src/htmlScraper');

async function rebrowserPageTests(page) {
    
    // dummyFn - must be called in the main context
    await page.evaluate(() => window.dummyFn());

    // exposeFunctionLeak
    // await page.exposeFunction('exposedFn', () => { console.log('exposedFn call') })

    // sourceUrlLeak
    await page.evaluate(() => document.getElementById('detections-json'));

    // mainWorldExecution - must be called in an isolated context
    await page.mainFrame().isolatedRealm().evaluate(() => document.getElementsByClassName('div'));
}

async function rebrowserMainTest() {
    let pHtml = new PageHTML();
    await pHtml.get('https://bot-detector.rebrowser.net/');
    await rebrowserPageTests(pHtml.page);
    await pHtml.get();
    let tables = pHtml.tables()[1][0];
    let results = {
        'dummyFn': 0,
        'sourceUrlLeak': 0,
        'mainWorldExecution': 0,
        'runtimeEnableLeak': 0,
        'viewport': 0,
    }
    if ((tables[1].filter(str => str.includes('window.dummyFn() was called'))).length > 0) {
        results.dummyFn = 1;
    } else {
        results.dummyFn = 0;
    }
    if ((tables[2].filter(str => str.includes('Error stack'))).length > 0) {
        results.sourceUrlLeak = 1;
    } else {
        results.sourceUrlLeak = 0;
    }
    if ((tables[3].filter(str => str.includes("test wasn't triggered"))).length > 0) {
        results.mainWorldExecution = 1;
    } else {
        results.mainWorldExecution = 0;
    }
    if ((tables[4].filter(str => str.includes('No leak'))).length > 0) {
        results.runtimeEnableLeak = 1;
    } else {
        results.runtimeEnableLeak = 0;
    }
    
    if (tables[7].map(str => {
        if (str.includes(pHtml.screenWidth) && str.includes(pHtml.screenHeight)) {
            return true;
        } else {
            return false;
        }
        }).includes(true)
    ) {
        results.viewport = 1;
    } else {
        results.viewport = 0;
    }
    pHtml.close();
    if (Object.keys(results).length === Object.values(results).reduce((a,b) => a + b)) {
        return true;
    } else {
        return false;
    }
}

async function checkUserAgent() {
    let pHtml = new PageHTML();
    await pHtml.get('https://www.whatsmyua.info/');
    let userAgentDetected = pHtml.content('li#rawUa')[0];
    userAgentDetected = userAgentDetected.replace('rawUa: ', '')
    pHtml.close();
    if (userAgentDetected === pHtml.userAgent) {
        return true;  
    } else {
        return false;
    }
}

async function checkLinks() {
    let pHtml = new PageHTML();
    await pHtml.get('https://www.example.com/');
    pHtml.close();
    let links = pHtml.links()[0];
    if (links[0].href === 'https://www.iana.org/domains/example') {
        return true;
    } else {
        return false;
    }
}

async function tableTest() {
    let pHtml = new PageHTML();
    await pHtml.get('https://en.wikipedia.org/wiki/List_of_Formula_One_Grand_Prix_winners','https://en.wikipedia.org/');
    pHtml.close();
    let tables = pHtml.tables()[0][2];
    if ((tables[1].filter(str => String(str).includes('Lewis'))).length > 0) {
        return true;
    } else {
        return false;
    }
}

test('User Agent Matches Expected Value', async () => {
    const result = await checkUserAgent();
    expect(result).toBe(true);
  }, 30000);

test('Perform Rebrowser Patch Checks', async () => {
    const result = await rebrowserMainTest();
    expect(result).toBe(true);
  }, 30000);

test('Confirm Links Retrieval', async () => {
    const result = await checkLinks();
    expect(result).toBe(true);
}, 30000)

test('Tables Retrieved Successfully', async () => {
    const result = await tableTest();
    expect(result).toBe(true);
}, 30000)