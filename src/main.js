const Audio = require('./audio');
const bufferSize = 1024;
const analyzer = new Audio(bufferSize);
const RumoursScene = require('./scenes/rumours/rumours');

const rumoursScene = new RumoursScene(analyzer);

function render() {
    rumoursScene.render();
    requestAnimationFrame(render);
}

render();


