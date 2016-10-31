const Audio = require('./audio');
const PIXI = require('pixi.js');
const BUFFER_SIZE = 1024;

class BaseScene {
    constructor() {
        this.analyzer = new Audio(BUFFER_SIZE);
        this.renderer = PIXI.autoDetectRenderer(800, 600, {antialias: true});

        this.stage = new PIXI.Container();
        this.stage.interactive = true;

        document.body.appendChild(this.renderer.view);
    }
}

module.exports = BaseScene;