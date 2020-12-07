class Options{
    constructor(rot, tilt, zoom = 20){
        this.index = IndexHelper.getIndex()
        this.rot = rot;                     //null = top down
        this.tilt = tilt;                 //null = top down
        this.zoom = zoom;                   
    }
}

class IndexHelper{
    static staticIndex = 0;
    static getIndex(){
        return this.staticIndex++;
    }
}

module.exports = Options