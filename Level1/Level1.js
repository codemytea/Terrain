/*************************LEVEL 1 - FLAT GRASSY PLANE***********************/
import {WorldTerrain} from "./WorldTerrain.js";
import {Grass} from "./Grass.js";
import {Lights} from "../Shared/Objects/Lights.js";
import {Cottage} from "./Cottage.js";
import {level1Sky, Sky} from "../Shared/Objects/Sky.js";
import {Scene} from "../Shared/Scene.js";
import {level2} from "../Level2/Level2.js";
import {ambientSound, stopSound, toStopSound} from "../Shared/Sound.js";
import {PlanarArrowControls} from "../Shared/PlanarArrowControls.js";

const startingWorld = new WorldTerrain()
const arrowControls = new PlanarArrowControls(0, 5, 20, 50, 50)

export const level1 = new Scene([
    startingWorld,
    ...startingWorld.getRandomTrees(0.0009),
    ...startingWorld.getRandomRocks(0.003),
    new Grass(),
    new Sky(level1Sky),
    new Lights(),
    new Cottage(),
    arrowControls

], arrowControls.camera, 10, true)

let treesPlanted = 0;
const goal = 10;
let l1DisplayedBefore = false


function updateHUD() {

    const percentCompleted = (treesPlanted / goal) * 100;

    document.getElementById('progressBarValue').style.width = percentCompleted.toFixed(2) + '%';

    if (treesPlanted >= goal && !l1DisplayedBefore) {
        l1DisplayedBefore = true
        document.getElementById('wellDoneMessage').innerText = 'Looks like your seed stock is getting low!\nPress Enter to go to the forest and collect some more.'
        document.getElementById('wellDoneMessage').style.display = 'block';
    }
}

function handleKeyPress(event) {
    if (event.key === 'p' || event.key === 'P') {
        treesPlanted++;
        updateHUD();
    }
    if ((event.key === 'Enter' || event.keyCode === 13) && treesPlanted >= goal) {
        document.getElementById('wellDoneMessage').style.display = 'none'
        document.getElementById('goal').innerText = 'Collect 5 pine tree seeds'
        document.getElementById('progressBarValue').style.width = 0 + '%';
        document.getElementById('bottomMessage').innerText = 'Location: Forest. Press S to collect seeds';
        stopSound(toStopSound.value);
        ambientSound('./Assets/forestAmbience.wav', 0.4)
        document.removeEventListener('keydown', handleKeyPress)
        document.getElementById('topInstructions').innerText = 'Use your forwards and backwards arrow key to move'
        level2.display()
    }
}

document.addEventListener('keydown', handleKeyPress);

updateHUD();

