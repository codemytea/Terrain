import {Scene} from "./Shared/Scene";
import {WorldTerrain as WT1} from "./Level1/WorldTerrain";
import {WorldTerrain as WT2} from "./Level2/WorldTerrain";
import {DUSTY_EVENING_SKY, MORNING_SKY, Sky} from "./Shared/Objects/Sky";
import {WaterSphere} from "./Level2/WaterSphere";
import {Lights} from "./Shared/Objects/Lights";
import {House} from "./Level1/House";
import {Grass} from "./Level1/Grass";
import {ArrowControls} from "./Shared/ArrowControls.js";
import * as THREE from "three";

/*************************START PAGE****************************/

const stream = './Assets/ambientNoise.wav';

let menu = new Scene([
    new Sky(MORNING_SKY),
], [0, 0, 5300], 0, false)

menu.display();

document.getElementById('menu').style.display = 'block'

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);

    startButton.addEventListener('click', function () {

        document.getElementById('menu').style.display = 'none'
        document.getElementById('gameplayContent').style.display = 'block'
        level1.display()

        audioLoader.load(stream, function(buffer) {
            audio.setBuffer(buffer);
            audio.setLoop(true);
            audio.play();
        });
    });
});


/*************************LEVEL 1 - FLAT GRASSY PLANE***********************/

const startingWorld = new WT1()

let level1 = new Scene([
    startingWorld,
    ...startingWorld.getRandomTrees(0.0009),
    ...startingWorld.getRandomRocks(0.003),
    new Grass(),
    new Sky(DUSTY_EVENING_SKY),
    new Lights(),
    new House()

], [0, 5, 20], 10)

let treesPlanted = 0;
const goal = 10;


function updateHUD() {

    const percentCompleted = (treesPlanted / goal) * 100;

    document.getElementById('progressBarValue').style.width = percentCompleted.toFixed(2) + '%';

    if (treesPlanted >= goal) {
        document.getElementById('wellDoneMessage').style.display = 'block';
    }
}

function handleKeyPress(event) {
    if (event.key === 'p' || event.key === 'P') {
        treesPlanted++;
        updateHUD();
    }
    if ((event.key === 'Enter' || event.keyCode === 13) && treesPlanted >= goal){
        document.getElementById('wellDoneMessage').style.display = 'none'
        document.getElementById('hud').style.display = 'none'
        document.getElementById('bottomMessage').innerText = 'Location: Forest';
        level2.display()
    }
}

document.addEventListener('keydown', handleKeyPress);

updateHUD();



/*************************LEVEL 2 - FULL WORLD SPHERE***********************/

const fullWorld = new WT2()
const arrowControls = new ArrowControls(-1010, fullWorld.mesh)
let level2 = new Scene([
    fullWorld,
    new Sky(DUSTY_EVENING_SKY),
    ...fullWorld.getRandomTrees(0.1),
    new WaterSphere(),
    new Lights(),
    arrowControls

], arrowControls.camera, 300, false, true)




/**
 * TODO:
 *
 * segment this file - disable listeners
 *
 * integrate with arrow controls
 *
 * stop being able to move off scene or into model in level 1.
 *
 * check blender
 *
 * comment
 *
 *
 * report
 *
 * check reqs again
 *
 * deal with rocks exporting too high res
 *
 * deal with jerky - isaacs mesh?
 *
 * */
