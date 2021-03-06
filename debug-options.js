const { abs, sqrt } = require('mathjs');

const fs = require('fs').promises;
class DebugOptions{
    constructor(){
        this.latOld = undefined;
        this.latNew = undefined;
        this.longOld = undefined;
        this.longNew = undefined;
    }

    async update(URL){
        this.latOld = this.latNew;
        this.longOld = this.longNew;
        
        this.latNew = URL.split('@')[1].split(',')[0]
        this.longNew = URL.split('@')[1].split(',')[1]

        if(this.latOld != undefined 
        && this.latNew != undefined 
        && this.longOld != undefined 
        && this.longNew != undefined){
            var latDiff = abs(this.latNew - this.latOld);
            var longDiff = abs(this.longNew - this.longOld);
            var diff = sqrt(Math.pow(latDiff,2) + Math.pow(longDiff,2))
            if(diff != 0)
                await writeToDebugFile(diff.toFixed(7).replace(".",","));
        }
    }
}

module.exports = DebugOptions;

async function writeToDebugFile(buffer){
    const filehandle = await fs.open("temp.md", "a");
    await filehandle.appendFile(`${buffer}\n`);
    await filehandle.close();
}