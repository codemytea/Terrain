import {Scene} from "./Shared/Scene.js";
import {menuSky, Sky} from "./Shared/Objects/Sky.js";
import {level1} from "./Level1/Level1.js";
import {ambientSound, toStopSound} from "./Shared/Sound.js";

/*************************START PAGE****************************/



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
        document.getElementById('topInstructions').innerText = 'Use your arrow keys to move and your mouse to look around. Click the screen again if you press escape'
        level1.display()

        toStopSound.value = ambientSound('./Assets/ambientNoise.wav', 0.4)
        ambientSound('./Assets/wind.wav', 0.1)
    });
});
