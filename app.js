const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');
const helper = require('./helper');

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

    await helper.consentToCoockies(page);
    await helper.switchTo3D(page);
    await helper.tiltView(page);
    await helper.removeLabels(page);
    await helper.removeIcons(page);

    //wait to load page
    await page.waitForTimeout(5000);

    
    const x = page.viewport().width / 2;
    const y = page.viewport().height / 2;
    const dist = 10;

    for(var i = 0; i < 100; i++){
        // for(j = 0; j<4; j++){
        //     await page.evaluate(() => {
        //         document.querySelector(".compass-clockwise-arrow").click();
        //     });
        //     await page.waitForTimeout(1000);
        //     await page.screenshot({path: `screenshots/screenshot${i}-${j}.png`});
        // }
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
        
    }
  
    await page.waitForTimeout(5000);
    await page.screenshot({path: 'screenshots/screenshot.png'});

    await browser.close();
})();