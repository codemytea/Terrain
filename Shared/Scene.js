import * as THREE from "three";
import {Renderer} from "./Renderer";

export class Scene{
    movementAllowed;
    startTime = Date.now();

    constructor(objects, camera, movementSpeed, movementAllowed = true) {
        this.movementAllowed = movementAllowed

        this.objects = objects

        this.camera = camera
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0xffffff, 0.01, 2500);




        //start loading

        this.objects.forEach(o => o.add(this.scene))

        //stop loading

        this.setupWindow()
    }

    display(){

        const clock = new THREE.Clock()
        const loop = ()=>{
            requestAnimationFrame(loop);

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
        });
    }





}