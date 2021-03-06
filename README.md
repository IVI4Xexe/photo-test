# photo-test

## Requirements:
* nodejs >= v15.8.0
* npm >= v7.5.4
* `npm i minimist`, `npm i mathjs`, `npm i puppeteer`
or
* `npm ci`

## options:

* `--lat=[float]` latitude, mandatory
* `--long=[float]` longitude, mandatory
* `--debug` show mouse in browser and log shell edge movement difference in ./temp.md, default: false
* `--delay=[uint]` seconds waiting to load google maps, default: 1
* `--delayBetween=[uint]` seconds waiting between screenshots, default: 1
* `--parallel=[uint]` parallel browsers, default: 1 
* `--heightMin=[ufloat]` min height, default: 20.0
* `--heightMax=[ufloat]` max height, default: 20.0
* `--heightStep=[ufloat]` iteration steps between height, default: 0.1
* `--topDown` include top down view, default: false
* `--rotationStep=[uint]` number of equaly spaced horizontal rotations; default: 4tilt
* `--tiltStep=[uint]` number of additional equaly spaced vertical tilts in both directions; default: 0
* `--shellEdge=[uint]` edges on shell, higher number means more screenshots, default: 10
* `--shellEdgeStep=[uint]` stepsize in px: default: 50


## example: 
`node app.js --lat=48.7451191 --long=9.3222745  --delay=10 --parallel=4`