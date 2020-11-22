const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');
const helper = require('./helper');
const argv = require('minimist')(process.argv.slice(2));

(async () => {
    const delay = argv.delay != null ? parseInt(argv.delay) : 1;
    const rots = [0,1,2,3];
    const promises = rots.map(rot => excecuteAsync(rot, delay));

    await Promise.all(promises);    
})();

async function excecuteAsync(rot, delay){
    console.log(`promise ${rot} started`)
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    })

    //debug Mode
    if(argv.debug == "true")
        await installMouseHelper(page);

    const x = page.viewport().width / 2;
    const y = page.viewport().height / 2;
    const dist = 50;

    //const url = `https://www.google.de/maps/@${argv.lat},${argv.long},115a,35y,45.88t/data=!3m1!1e3?hl=de`;
    const url = `https://www.google.de/maps/@${argv.lat},${argv.long},${20}z/data=!3m1!1e3?hl=de`;
    await page.goto(url, {"waitUntil" : "networkidle0"});

    await helper.consentToCoockies(page);
    await helper.switchTo3D(page);
    await helper.tiltView(page);
    await helper.rotate(page, rot);
    await helper.removeLabels(page);
    await helper.removeIcons(page);

    //wait to load page
    await page.waitForTimeout(1000 * delay);

    for(var i = 0; i < 10; i++){
        var distMultiplier = Math.floor(i / 2) + 1;
        for(var j = 0; j<distMultiplier; j++){
            
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

    await browser.close();

    console.log(`promise ${rot} returns`)

    return;
};