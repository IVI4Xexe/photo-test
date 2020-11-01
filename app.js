const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    })
    await installMouseHelper(page);

    await page.goto('https://www.google.de/maps/@48.7832156,9.2561116,99a,35y,180h,39.45t/data=!3m1!1e3', {"waitUntil" : "networkidle0"});

    //Consent to Coockies...
    const frames = await page.frames();
    const googleConsentFrame = frames.find(f => f.url().includes("consent.google"));
    await (await googleConsentFrame.$("#introAgreeButton")).click();

    //Switch to 3D
    await page.evaluate(() => {
        document.querySelector("#globe-toggle > div > button").click();
    });
    
    await page.waitForTimeout(5000);

    await page.evaluate(() => {
        document.querySelector("#tilt > div > button").click();
    });
    
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
        document.querySelector(".searchbox-hamburger-container > button").click();
    });
    
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
        document.querySelector(".widget-settings-earth-item button:nth-child(2)").click();
    });
    
    await page.waitForTimeout(1000);

    //remove icons / buttons / etc
    //https://gist.github.com/loderunner/4c05a047831d1f6e440a8a33563ff175
    await page.evaluate(() => {
        const toDelete = [];
        const contentContainer = document.getElementById('content-container');
        for (const c of contentContainer.children) {
            if (c.id !== 'scene') {
                toDelete.push(c);
            } else {
                for (const d of c.children) {
                    if (!d.classList.contains('widget-scene')) {
                        toDelete.push(d);
                    }
                }
            }
        }
        for (const c of toDelete) {
            c.remove();
        }
    });

    //wait to load page
    await page.waitForTimeout(5000);
    const x = page.viewport().width / 2;
    const y = page.viewport().height / 2;
    const dist = 10;

    for(var i = 0; i < 100; i++){
        await page.screenshot({path: `screenshots/screenshot${i}.png`});

        var xMove = x;
        var yMove = y;
        var distMultiplier = Math.floor(i / 2) + 1;

        if(i % 4 == 0){
            xMove += distMultiplier * dist;
        }else if(i % 4 == 1){
            yMove += distMultiplier * dist;
        }else if(i % 4 == 2){
            xMove -= distMultiplier * dist;
        }else if(i % 4 == 3){
            yMove -= distMultiplier * dist;
        }

        await page.mouse.down();
        await page.mouse.move(x, y);
        await page.mouse.move(xMove, yMove);
        await page.mouse.up();
        await page.waitForTimeout(1000);
    }
  
    await page.waitForTimeout(5000);
    await page.screenshot({path: 'screenshots/screenshot.png'});

    await browser.close();
})();