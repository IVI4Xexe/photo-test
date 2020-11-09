const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');
const helper = require('./helper');


(async () => {
    // var myArgs = process.argv.slice(2);
    // console.log('myArgs: ', myArgs);
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    })

    const x = page.viewport().width / 2;
    const y = page.viewport().height / 2;
    const dist = 50;

    //only for debugging!
    await installMouseHelper(page);


    for(var rot = 0; rot < 4; rot++){
        await page.goto('https://www.google.de/maps/@48.7441421,9.3224667,115a,35y,45.88t/data=!3m1!1e3?hl=de', {"waitUntil" : "networkidle0"});

        await helper.consentToCoockies(page);
        await helper.switchTo3D(page);
        await helper.tiltView(page);
        await helper.rotate(page, rot);
        await helper.removeLabels(page);
        await helper.removeIcons(page);
    
        //wait to load page
        await page.waitForTimeout(5000);
    
        for(var i = 0; i < 10; i++){
            var distMultiplier = Math.floor(i / 2) + 1;
            for(var j = 0; j<distMultiplier; j++){
                console.log(rot,i,j);
                var xMove = x;
                var yMove = y;
                
                await page.screenshot({path: `screenshots/screenshot${rot}-${i}-${j}.png`});
    
                if(i % 4 == 0){
                    xMove += dist;
                }else if(i % 4 == 1){
                    yMove += dist;
                }else if(i % 4 == 2){
                    xMove -= dist;
                }else if(i % 4 == 3){
                    yMove -= dist;
                }
        
                await page.mouse.down();
                await page.mouse.move(x, y);
                await page.waitForTimeout(100);
                await page.mouse.move(xMove, yMove);
                await page.mouse.up();
            }
        }
    }
  
    await page.waitForTimeout(5000);

    await browser.close();
})();