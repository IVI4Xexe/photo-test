class Options{
    constructor(rot, zoom = 20){
        this.index = IndexHelper.getIndex()
        this.rot = rot;
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