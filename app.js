const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');
const maps = require('./maps');
const argv = require('minimist')(process.argv.slice(2));

(async () => {
    //console.log(argv);
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    })

    //debug Mode
    if(argv.debug)
        await installMouseHelper(page);  

    //Mode
    switch (argv.mode) {
        case 'maps':
            await maps.execute(page, argv);
            break;
        default:
            break;
    }
    
    await page.waitForTimeout(5000);

    await browser.close();
})();