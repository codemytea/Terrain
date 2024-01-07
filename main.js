import {Scene} from "./Shared/Scene.js";
import {menuSky, Sky} from "./Shared/Objects/Sky.js";
import {level1} from "./Level1/Level1.js";
import {ambientSound, toStopSound} from "./Shared/Sound.js";

/*************************START PAGE****************************/

document.getElementById('wellDoneMessage').style.display = 'none'

let menu = new Scene([
    new Sky(menuSky),
], [0, 0, 5300], 0)

menu.display();

document.getElementById('menu').style.display = 'block'

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', function () {

        document.getElementById('menu').style.display = 'none'
        document.getElementById('gameplayContent').style.display = 'block'
        document.getElementById('progressMsg').style.display = 'none'
        document.getElementById('goal').innerText = 'Plant 10 trees'
        document.getElementById('topInstructions').innerText = '1) Click on the screen 2) use your arrow keys to move 3) use your mouse to look around \nIf you click outside the screen or press escape, click in the screen to start moving again'
        level1.display()

        toStopSound.value = ambientSound('./Assets/ambientNoise.wav', 0.4)
        ambientSound('./Assets/wind.wav', 0.1)
    });
});