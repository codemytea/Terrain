import * as THREE from "three";
import {FirstPersonControls} from "three/addons/controls/FirstPersonControls";
import {Renderer} from "./Renderer";

export class Scene{
    movementAllowed;

    constructor(objects, cameraStart, movementSpeed, movementAllowed = true) {
        this.movementAllowed = movementAllowed

        this.objects = objects

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0xffffff, 0.01, 2500);


        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 0, cameraStart)
        this.camera.rotateZ(Math.PI*2)
        if (this.movementAllowed){
            this.controls = new FirstPersonControls(this.camera, Renderer.instance.renderer.domElement);
            this.controls.movementSpeed = movementSpeed;
            this.controls.lookSpeed = 0.1;
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
            const d = clock.getDelta()
            if (this.movementAllowed){
                this.controls.update(d);
            }


            this.objects.forEach((o)=>{
                if(!!o.onNewFrame){
                    o.onNewFrame(d)
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