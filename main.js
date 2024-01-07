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

function ambientSound(filename, volume){
    const sound = new Audio(filename)
    sound.play()
    sound.volume = volume
    sound.addEventListener('ended', ()=>ambientSound(filename, volume))
    return sound
}

function stopSound(audio){
    audio.pause()
}

let toStopSound;

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
        document.getElementById('progressMsg').style.display = 'none'
        document.getElementById('goal').innerText = 'Plant 10 trees'
        level1.display()

        toStopSound = ambientSound('./Assets/ambientNoise.wav', 0.4)
        ambientSound('./Assets/wind.wav', 0.1)
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
let l1DisplayedBefore = false


function updateHUD() {

    const percentCompleted = (treesPlanted / goal) * 100;

    document.getElementById('progressBarValue').style.width = percentCompleted.toFixed(2) + '%';

    if (treesPlanted >= goal && !l1DisplayedBefore) {
        l1DisplayedBefore = true
        document.getElementById('wellDoneMessage').innerText = 'Looks like your seed stock is getting low! Press Enter to go to the forest and collect some more.'
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
        document.getElementById('goal').innerText = 'Collect 5 pine tree seeds'
        document.getElementById('progressBarValue').style.width = 0 + '%';
        document.getElementById('bottomMessage').innerText = 'Location: Forest. Press S to collect seeds';
        stopSound(toStopSound);
        ambientSound('./Assets/forestAmbience.wav', 0.4)
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


let seedsCollected = 0;
let goal2 = 5;
let l2DisplayedBefore = false


function updateHUDSeeds() {

    const percentCompleted = (seedsCollected / goal2) * 100;

    document.getElementById('progressBarValue').style.width = percentCompleted.toFixed(2) + '%';

    if (seedsCollected >= goal2 && !l2DisplayedBefore) {
        l2DisplayedBefore = true
        document.getElementById('wellDoneMessage').innerText = 'You\'ve replenished your stock. Enjoy cruising.';
        document.getElementById('wellDoneMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('wellDoneMessage').style.display = 'none';
            document.getElementById('hud').style.display = 'none';
            document.getElementById('bottomMessage').innerText = 'Location: Forest.';
        }, 2500)
    }
}

function handleKeyPress2(event) {
    if (event.key === 's' || event.key === 'S') {
        seedsCollected++;
        updateHUDSeeds();
    }

}

document.addEventListener('keydown', handleKeyPress2);

updateHUDSeeds();




/**
 * TODO:
 *
 * segment this file - disable listeners
 *
 * integrate with arrow controls
 *
 * stop being able to move off scene or into model in level 1.
 *
 * sky??? either put camera on top of world or moving sky
 *
 * water not reflecting!!!
 *
 * escape to go back to l1
 *
 *
 * shadows on l1
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
 * */
