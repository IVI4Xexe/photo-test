const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');
const helper = require('./helper');
const debugOptions = require('./debug-options');
const fs = require('fs').promises;
const Options = require('./options');
require('./extensions')
const argv = require('minimist')(process.argv.slice(2));

(async () => {
    const delay = argv.delay != null ? parseInt(argv.delay) : 1;
    const parallel = argv.parallel != null ? parseInt(argv.parallel) : 1;
    const heightMin = argv.heightMin != null ? parseFloat(argv.heightMin) : 20.0;
    const heightMax = argv.heightMax != null ? parseFloat(argv.heightMax) : 20.0;
    const heightStep = argv.heightStep != null ? parseFloat(argv.heightStep) : 0.1;
    const topDown = argv.topDown == "true";
    const rotationStep = argv.rotationStep != null ? parseInt(argv.rotationStep) : 4;
    const tiltStep = argv.tiltStep != null ? parseInt(argv.tiltStep) : 0;
    const shellEdge = argv.shellEdge != null ? parseInt(argv.shellEdge) : 10;

    const options = []
    for(var height = heightMin; height <= heightMax; height+= heightStep){
        for(var step = 0; step < rotationStep; step++){
            for(var tilt = -tiltStep; tilt <= tiltStep; tilt++){
                options.push(new Options(step, tilt, height.toString()))
            }
        }
        if(topDown)
            options.push(new Options(null, null, height.toString()))
    }
    
    const runsChunks = options.chunk(parallel);

    const directory = "screenshots";
    await fs.rmdir(directory, { recursive: true })
        .then(() => fs.mkdir(directory));

    if(argv.debug == "true"){
        let filehandle = await fs.open("temp.md", "w+");
        await filehandle.truncate();
    }

    for(var runs of runsChunks){
        var promises = runs.map(option => excecuteRunAsync(option, delay, rotationStep, tiltStep, shellEdge, options.length));
        await Promise.all(promises); 
    }
})();

async function excecuteRunAsync(options, delay, rotationStep, tiltStep, shellEdge, promisesLength){
    console.log(`promise ${options.index + 1}/${promisesLength} started`)

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    })

    //debug Mode
    if(argv.debug == "true"){
        await installMouseHelper(page);
        var debug = new debugOptions();
    }
    
    const x = page.viewport().width / 2;
    const y = page.viewport().height / 2;
    const dist = 50;

    const url = `https://www.google.de/maps/@${argv.lat},${argv.long},${options.zoom}z/data=!3m1!1e3?hl=de`;
    await page.goto(url, {"waitUntil" : "networkidle0"});

    await helper.consentToCoockies(page);
    await helper.switchTo3D(page);
    await helper.removeLabels(page);
    if(options.rot != null){
        await helper.tiltView(page);
        await helper.rotate(page, options.rot, rotationStep);
    }
    if(options.tilt != null){
        await helper.tilt(page, options.tilt, tiltStep);
    }
    
    await helper.removeIcons(page);

    //wait to load page
    await page.waitForTimeout(1000 * delay);

    if(debug != null)
        debug.update(page.url());

    for(var i = 0; i < shellEdge; i++){
        var distMultiplier = Math.floor(i / 2) + 1;
        for(var j = 0; j<distMultiplier; j++){
            
            var xMove = x;
            var yMove = y;
            
            await page.screenshot({path: `screenshots/screenshot${options.index}-${i}-${j}.png`});

            if(i % 4 == 0){
                xMove += dist;
            }else if(i % 4 == 1){
                yMove += dist;
            }else if(i % 4 == 2){
                xMove -= dist;
            }else if(i % 4 == 3){
                yMove -= dist;
            }
    
            await page.mouse.move(x, y);
            await page.mouse.down();
            await page.mouse.move(xMove, yMove, {steps: 100});
            await page.mouse.up();

            if(debug != null)
                debug.update(page.url());
        }
    }

    await browser.close();

    console.log(`promise ${options.index + 1} returns`)

    return;
};