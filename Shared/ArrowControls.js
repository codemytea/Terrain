import * as THREE from "three"
import {Clock, Spherical} from "three"
import {cameraPosition} from "three/nodes";

const maxV = 40/(Math.PI*10)
const a = 40/(Math.PI*10)
const g = 40/(Math.PI*10)
export class ArrowControls{



    camera; controls;
    velocity = new THREE.Spherical(0, 0, 0);
    left = false;
    right = false;
    forwards = false;
    backwards = false;
    rotateLeft = false
    rotateRight = false
    rotateUp = false
    rotateDown = false

    clock = new Clock()

    raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), 0, 100);
    constructor(cameraStart, world) {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, cameraStart)
        let sphericalPosition = new THREE.Spherical().setFromCartesianCoords(this.camera.position.x, this.camera.position.y, this.camera.position.z)
        let rotation = this.camera.rotation
        let truePhi = sphericalPosition.phi
        if(sphericalPosition.phi <= Math.PI){
            truePhi = -truePhi
        }
        let trueTheta = sphericalPosition.theta
        if(sphericalPosition.theta <= Math.PI){
            trueTheta = -trueTheta
        }
        this.camera.rotation.set(truePhi, trueTheta, rotation.z)
        //this.controls = new SphericalPointerLockControls(this.camera, document.body);
        this.world = world
        document.addEventListener( 'keydown', (e)=>this.onKeyDown(e) );
        document.addEventListener( 'keyup', (e)=>this.onKeyUp(e) );
    }

    add(scene){



        //scene.add(this.controls.getObject());
    }

    decelerate(dt){
        let a = g
        if(this.velocity.theta > 0){
            this.velocity.theta = Math.max(0, this.velocity.theta - a * dt)
        }
        else {
            this.velocity.theta = Math.min(0, this.velocity.theta + a * dt)
        }
        if(this.velocity.phi > 0){
            this.velocity.phi = Math.max(0, this.velocity.phi - a * dt)
        }
        else {
            this.velocity.phi = Math.min(0, this.velocity.phi + a * dt)
        }


    }

    async getDistanceFromGround(){

        let pos = this.camera.getWorldPosition(new THREE.Vector3())
        this.raycaster.set(pos, new THREE.Vector3(-pos.x, -pos.y, -pos.z).normalize())


        let inwardIntersections = this.raycaster.intersectObject(this.world, false).sort((a, b)=>a.distance-b.distance)


        if(inwardIntersections.length === 0){
            return 0
        }
        return inwardIntersections[0].distance




    }

    async onNewFrame(){
        let dt = this.clock.getDelta()

        this.decelerate(dt)

        let dViewLR = 0
        let dViewUD = 0
        if(this.left) this.onLeft(dt)
        if(this.right) this.onRight(dt)
        if(this.backwards) this.onBackward(dt)
        if(this.forwards) this.onForward(dt)
        if(this.rotateLeft) dViewLR += dt/(Math.PI)
        if(this.rotateRight) dViewLR -= dt/(Math.PI)
        if(this.rotateUp) dViewUD += dt/(Math.PI)
        if(this.rotateDown) dViewUD -= dt/(Math.PI)



        let dTheta = this.velocity.theta * dt
        let dPhi = this.velocity.phi * dt
        let dr = -await this.getDistanceFromGround()



        let pos = this.camera.position
        let sphericalPos = new Spherical().setFromCartesianCoords(pos.x, pos.y, pos.z)
        console.log([sphericalPos.theta*180/Math.PI, sphericalPos.phi*180/Math.PI])

        let newTheta = sphericalPos.theta + dTheta
        let newPhi = sphericalPos.phi + dPhi
        let newR = sphericalPos.radius + dr + 20


        this.camera.position.setFromSphericalCoords(newR, newPhi, newTheta)



        this.camera.rotateY(dTheta + dViewLR)
        this.camera.rotateX(dPhi + dViewUD)



    }


    onLeft(dt){
        this.velocity.theta = Math.max(-maxV, this.velocity.theta - dt * a)
    }

    onForward(dt){
        this.velocity.phi = Math.max(-maxV, this.velocity.phi - dt * a)
    }

    onBackward(dt){
        this.velocity.phi = Math.min(maxV, this.velocity.phi + dt * a)
    }

    onRight(dt){
        this.velocity.theta = Math.min(maxV, this.velocity.theta + dt * a)
    }

    onKeyDown(event) {

        switch ( event.code ) {

            case 'ArrowUp': return this.forwards = true;
            case 'ArrowLeft': return this.left = true;
            case 'ArrowDown': return this.backwards = true;
            case 'ArrowRight': return this.right = true;
            case 'KeyA': return this.rotateLeft = true;
            case 'KeyD': return this.rotateRight = true;
            case 'KeyW': return this.rotateUp = true;
            case 'KeyS': return this.rotateDown = true;

        }

    };

    onKeyUp(event) {

        switch ( event.code ) {

            case 'ArrowUp': return this.forwards = false;
            case 'ArrowLeft': return this.left = false;
            case 'ArrowDown': return this.backwards = false;
            case 'ArrowRight': return this.right = false;
            case 'KeyA': return this.rotateLeft = false;
            case 'KeyD': return this.rotateRight = false;
            case 'KeyW': return this.rotateUp = false;
            case 'KeyS': return this.rotateDown = false;

        }

    };



}