# photo-test
## options:

* `--lat=[float]` latitude, mandatory
* `--long=[float]` longitude, mandatory
* `--debug=[bool: [true|false]]` show mouse in browser and log shell edge movement difference in ./temp.md, default: false
* `--delay=[int]` seconds waiting to load google maps, default: 1
* `--parallel=[int]` parallel browsers, default: 1 
* `--heightMin=[float]` min height, default: 20.0
* `--heightMax=[float]` max height, default: 20.0
* `--heightStep=[float]` iteration steps between height, default: 0.1
* `--topDown=[true|false]` include top down view, default: false
* `--rotationStep=[int]` angle = 360° / rotationStep; default: 4
* `--shellEdge=[int]` edges on shell, higher number means more screenshots, default: 10


## example: 
`node app.js --lat=48.7451191 --long=9.3222745  --delay=10 --parallel=4`