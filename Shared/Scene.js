import * as THREE from "three";
import {FirstPersonControls} from "three/addons/controls/FirstPersonControls";
import {Renderer} from "./Renderer";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FlyControls} from "three/addons";

export class Scene{
    movementAllowed;
    startTime = Date.now();

    constructor(objects, cameraStart, movementSpeed, movementAllowed = true) {
        this.movementAllowed = movementAllowed

        this.objects = objects

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0xffffff, 0.1, 200);


        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(cameraStart[0], cameraStart[1], cameraStart[2])
        this.camera.rotateZ(Math.PI*2)
        if (this.movementAllowed){
            this.controls = new FlyControls(this.camera, Renderer.instance.renderer.domElement);
            this.controls.movementSpeed = movementSpeed;
            this.controls.rollSpeed = 0.5;
        }

        //start loading

        this.objects.forEach(o => o.add(this.scene))

        //stop loading

        this.setupWindow()
    }

    display(){

        const clock = new THREE.Clock()
        const loop = ()=>{
            requestAnimationFrame(loop);
            if (this.movementAllowed){
                this.controls.update(clock.getDelta());
            }


            this.objects.forEach((o)=>{
                if(!!o.onNewFrame){
                    o.onNewFrame(Date.now() - this.startTime)
                }
            })

            Renderer.instance.renderer.render(this.scene, this.camera);
        }
        loop()
    }

    setupWindow(){
        window.addEventListener('resize', _ => {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            Renderer.instance.renderer.setSize(window.innerWidth, window.innerHeight);

            if (this.movementAllowed){
                this.controls.handleResize();
            }

        });
    }





}