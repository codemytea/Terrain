/*************************LEVEL 2 - FULL WORLD SPHERE***********************/
import {WorldTerrain as WT2} from "./WorldTerrain.js";
import {ArrowControls} from "../Shared/ArrowControls.js";
import {Scene} from "../Shared/Scene.js";
import {level2Sky, Sky} from "../Shared/Objects/Sky.js";
import {WaterSphere} from "./WaterSphere.js";
import {Lights} from "../Shared/Objects/Lights.js";


const fullWorld = new WT2()
const arrowControls = new ArrowControls(-1010, fullWorld.mesh)
export const  level2 = new Scene([
    fullWorld,
    new Sky(level2Sky),
    fullWorld.getRandomTrees(0.1),
    new WaterSphere(),
    new Lights(),
    arrowControls

], arrowControls.camera, 300, true)


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

