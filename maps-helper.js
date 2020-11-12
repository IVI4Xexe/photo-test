module.exports = {
    consentToCoockies: async function(page){
        const frames = await page.frames();
        const googleConsentFrame = frames.find(f => f.url().includes("consent.google"));
        if(googleConsentFrame !== undefined)
            await (await googleConsentFrame.$("#introAgreeButton")).click();
    },

    switchTo3D: async function(page){
        await page.evaluate(() => {
            document.querySelector("#globe-toggle > div > button").click();
        });
        await page.waitForTimeout(5000);
    },

    tiltView: async function(page){
        await page.evaluate(() => {
            document.querySelector("#tilt > div > button").click();
        });
        await page.waitForTimeout(1000);
    },

    rotate: async function(page, rot){
        for(var i = rot; i > 0; i--){
            await page.evaluate(() => {
                document.querySelector("#compass > div > button.compass-clockwise-arrow.widget-compass-sprite").click();
            });
            await page.waitForTimeout(1000);
        }
    },

    removeLabels: async function(page){
        await page.evaluate(() => {
            document.querySelector(".searchbox-hamburger-container > button").click();
        });
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            document.querySelector(".widget-settings-earth-item button:nth-child(2)").click();
        });
        await page.waitForTimeout(2000);
    },

    removeIcons: async function(page){
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
    }
}