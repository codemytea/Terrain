import {Scene} from './Shared/Scene.js'
import {MORNING_SKY, Sky} from './Shared/Objects/Sky.js'


new Scene([
    new Sky(MORNING_SKY),
], [0, 0, 5300], 0, false).display()

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', function () {
        // Redirect to your 3D application
        window.location.href = './Shared/index.html';
    });
});
