import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import * as THREE from "three";
import {color} from "three/nodes";

//light silt - bottom of water
//dark silt - around water
//dark green - moss
//brown - soil under trees

export class TerrainGenerator{
    lightSilt =
        new TerrainType(0.2, 0.4, color(30, 176, 251));
    darkSilt =
        new TerrainType(0.4, 0.5, color(215, 192, 158));
    foliage =
        new TerrainType(0.5, 0.7, color(2, 166, 155));
    soil =
        new TerrainType(0.7, 0.75, color(22, 181, 141));

    static generateHeight(width, height) {
        const size = width * height
        const data = new Uint8Array(size);
        const perlin = new ImprovedNoise()
        const temp = Math.sin(Math.PI/4) * 10000
        const z = (temp - Math.floor(temp)) * 100;

        let quality = 1;

        for (let j = 0; j < 4; j ++) {
            for (let i = 0; i < size; i ++) {
                const x = i % width
                const y = ~~(i / width);
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            quality *= 5;
        }

        return data;
    }


    static generateTexture(data, width, height) {
        const vector3 = new THREE.Vector3(0, 0, 0);

        const sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        let context = canvas.getContext('2d');
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        let image = context.getImageData(0, 0, canvas.width, canvas.height);
        let imageData = image.data;

        for (let i = 0; i < imageData.length; i ++) {
            vector3.x = data[i - 2] - data[i + 2];
            vector3.y = 2;
            vector3.z = data[i - width * 2] - data[i + width * 2];
            vector3.normalize();

            const shade = vector3.dot(sun);

            imageData[i*4] = (96 + shade * 128) * (0.5 + data[i] * 0.007);
            imageData[i*4 + 1] = (32 + shade * 96) * (0.5 + data[i] * 0.007);
            imageData[i*4 + 2] = (shade * 96) * (0.5 + data[i] * 0.007);
        }

        context.putImageData(image, 0, 0);

        return canvas;
    }
}

