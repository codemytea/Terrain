import * as THREE from "../../External Libraries/three/three.module.js";
import {Renderer} from "./Renderer.js";

/**
 * The Scene class manages the scene.
 */
export class Scene {

    /** The timestamp when the scene was initialized. */
    clock = new THREE.Clock()
    startTime = Date.now()

    /**
     * Constructs a Scene object with specified objects, camera parameters, movement speed, and optional settings.
     * @param {THREE.Object3D[]} objects - An array of 3D objects to be added to the scene.
     * @param {number[]} cameraParams -  initial position [x, y, z].
     * @param {number} movementSpeed - The speed of camera movement if allowed.
     * @param {boolean} [cameraProvided=false] - Indicates whether an external camera is provided.
     */
    constructor(objects, cameraParams, movementSpeed, cameraProvided = false) {

        this.objects = objects
        this.camera = cameraParams

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.005);


        if (!cameraProvided) {
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
            this.camera.position.set(cameraParams[0], cameraParams[1], cameraParams[2])
            this.camera.rotateZ(Math.PI * 2)
        }

        //start loading

        this.objects.forEach(o => o.add(this.scene))

        //stop loading

        this.setupWindow()
    }

    /**
     * Displays the scene, updating controls and rendering on each frame.
     */
    display() {
        const loop = () => {
            requestAnimationFrame(loop);


            this.objects.forEach((o) => {
                if (!!o.onNewFrame) {
                    o.onNewFrame(this.clock.getDelta(), this.startTime - Date.now())
                }
            });

            // Render the scene
            Renderer.instance.renderer.render(this.scene, this.camera);
        }
        loop()
    }

    /**
     * Sets up window resize handling to update camera aspect ratio and control resizing.
     */
    setupWindow() {
        window.addEventListener('resize', _ => {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            Renderer.instance.renderer.setSize(window.innerWidth, window.innerHeight);

        });
    }


}