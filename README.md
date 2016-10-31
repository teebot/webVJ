# WebVJ

A VJing experiment on the Web platform using [Pixi.js](https://github.com/pixijs/pixi.js) for animations and [meyda](https://github.com/hughrawlinson/meyda) for audio analysis.  


## Install

    yarn
    
## Run

    yarn start

## Adding a scene

Just add a new scene class in the scenes directory. Your class should `extend BaseScene` and implement both `setup` and `render`.
Check the example scene for beat detection.
