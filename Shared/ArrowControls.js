import * as THREE from "three"
import {Clock, Spherical} from "three"
import {cameraPosition, sign} from "three/nodes";

const maxV = 7
const a = 15
const g = 10


const xAxis = /*@__PURE__*/ new THREE.Vector3( 1, 0, 0 );
const yAxis = /*@__PURE__*/ new THREE.Vector3( 0, 1, 0 );
const ZAxis = /*@__PURE__*/ new THREE.Vector3( 0, 0, 1 );
export class ArrowControls{



    camera; controls;
    velocity = {forward: 0, left: 0}
    left = false;
    right = false;
    forwards = false;
    backwards = false;
    rotateLeft = false
    rotateRight = false
    rotateUp = false
    rotateDown = false

    clock = new Clock()

    currentPhi

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
        this.currentPhi = sphericalPosition.phi
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
        if(this.velocity.forward > 0){
            this.velocity.forward = Math.max(0, this.velocity.forward - a * dt)
        }
        else {
            this.velocity.forward = Math.min(0, this.velocity.forward + a * dt)
        }
        if(this.velocity.left > 0){
            this.velocity.left = Math.max(0, this.velocity.left - a * dt)
        }
        else {
            this.velocity.left = Math.min(0, this.velocity.left + a * dt)
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

    signPhi = -1
    signTheta = 1

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


        let dr = -await this.getDistanceFromGround()



        let pos = this.camera.position
        let sphericalPos = new Spherical().setFromCartesianCoords(pos.x, pos.y, pos.z)

        let newR = sphericalPos.radius + dr + 40

        this.camera.position.setFromSphericalCoords(newR, sphericalPos.phi, sphericalPos.theta)

        let facingForward = this.camera.getWorldDirection(new THREE.Vector3()).normalize().multiplyScalar(this.velocity.forward)
        let position = this.camera.getWorldPosition(new THREE.Vector3()).normalize()
        let facingLeft = new THREE.Vector3(0, 0, 0)
        let oldPos = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z)
        this.camera.position.set(facingForward.x + facingLeft.x + oldPos.x, facingForward.y + facingLeft.y + oldPos.y, facingForward.z + facingLeft.z + oldPos.z)
        let newPos = this.camera.position
        let oldPosSpherical = new Spherical().setFromCartesianCoords(oldPos.x, oldPos.y, oldPos.z)
        let newPosSpherical = new Spherical().setFromCartesianCoords(newPos.x, newPos.y, newPos.z)

        let dTheta = newPosSpherical.theta - oldPosSpherical.theta
        let dPhi = newPosSpherical.phi - oldPosSpherical.phi


        if(Math.abs(dTheta) < 1) {
            this.camera.rotateOnWorldAxis(yAxis, dTheta * this.signTheta)
        } else{
            this.signPhi = -this.signPhi
        }
        if(Math.abs(dPhi) < 1) {
            this.camera.rotateOnWorldAxis(xAxis, this.signPhi * dPhi)
        }
        else{
            this.signTheta =  -this.signTheta
        }









    }


    onRight(dt){
        this.velocity.left = Math.max(-maxV, this.velocity.left - dt * a)
    }

    onBackward(dt){
        this.velocity.forward = Math.max(-maxV, this.velocity.forward - dt * a)
    }

    onForward(dt){
        this.velocity.forward = Math.min(maxV, this.velocity.forward + dt * a)
    }

    onLeft(dt){
        this.velocity.left= Math.min(maxV, this.velocity.left + dt * a)
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