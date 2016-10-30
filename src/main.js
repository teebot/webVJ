const Audio = require('./audio');
const _ = require('lodash');
const THREE = require('three');
const bufferSize = 1024;
const analyzer = new Audio(bufferSize);

const bassElem = document.querySelector('.bass');
const snareElem = document.querySelector('.snare');

// Bark bands for each instrument
const INSTRUMENT_BANDS = {
    BASS_DRUM: {from: 0, to: 1, treshold: 1.1},
    SNARE: {from: 1, to: 2, treshold: 1.1}
};

const filter = (instrumentBands, loudness) => {
    if (!loudness.specific)
        return 0;

    const mean = _.mean(loudness.specific.slice(instrumentBands.from, instrumentBands.to + instrumentBands.from));
    if (mean < instrumentBands.treshold) {
        return 0;
    }
    return mean;
};

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();
var material = new THREE.LineBasicMaterial({
    color: 0x0000ff
});
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 10, 0));
geometry.vertices.push(new THREE.Vector3(10, 0, 0));
var line = new THREE.Line(geometry, material);


function render(time) {

    let features = analyzer.get(['loudness']);

    if (features) {
        let bassDrum = filter(INSTRUMENT_BANDS.BASS_DRUM, features.loudness);
        bassElem.innerText = bassDrum;

        let snare = filter(INSTRUMENT_BANDS.SNARE, features.loudness);
        snareElem.innerText = snare;
        if (snare) {
            scene.add(line);
        } else {
            scene.remove(line);
        }
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();
