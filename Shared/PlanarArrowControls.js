import * as THREE from "../External Libraries/three/three.module.js";
import {PointerLockControls} from "../External Libraries/three/Addons/PointerLockControls.js";


const g = 9.81 // ms^-2
const maxV = 10 // ms^-1
const a = 40 // ms^-2
export class PlanarArrowControls {
    camera;
    controls
    velocity = new THREE.Vector3(0, 0, 0)
    clock = new THREE.Clock()

    keyMap = {
        left: {key: 'ArrowLeft', value: false},
        right: {key: 'ArrowRight', value: false},
        forwards: {key: 'ArrowUp', value: false},
        backwards: {key: 'ArrowDown', value: false}
    }

    constructor(x, y, z, xMax, zMax) {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.controls = new PointerLockControls(this.camera, document.body)
        this.camera.position.set(x, y, z)
        this.xMax = xMax
        this.zMax = zMax
        document.addEventListener('keydown', (e) => this.onKeyDown(e))
        document.addEventListener('keyup', (e) => this.onKeyUp(e))
        this.setupCapture()
    }

    add(scene) {
        scene.add(this.controls.getObject())
    }

    decelerate(dt) {
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(0, this.velocity.x - g * dt)
        } else {
            this.velocity.x = Math.min(0, this.velocity.x + g * dt)
        }
        if (this.velocity.z > 0) {
            this.velocity.z = Math.max(0, this.velocity.z - g * dt)
        } else {
            this.velocity.z = Math.min(0, this.velocity.z + g * dt)
        }
    }


    onNewFrame() {


        const dt = this.clock.getDelta()
        this.decelerate(dt)

        //Move dependent on keys
        if (this.keyMap.left.value) this.moveLeft(dt)
        if (this.keyMap.right.value) this.moveRight(dt)
        if (this.keyMap.backwards.value) this.moveBackward(dt)
        if (this.keyMap.forwards.value) this.moveForward(dt)

        const dx = this.velocity.x * dt
        const dz = this.velocity.z * dt

        if (Math.abs(this.controls.getObject().position.x) >= this.xMax - dx) {
            this.velocity.x = 0
            this.controls.getObject().position.x = this.xMax * (Math.abs(this.controls.getObject().position.x) / this.controls.getObject().position.x)
        } else {
            this.controls.moveRight(dx)
        }
        if (Math.abs(this.controls.getObject().position.z) >= this.zMax - dz) {
            this.velocity.x = 0
            this.controls.getObject().position.z = this.zMax * (Math.abs(this.controls.getObject().position.z) / this.controls.getObject().position.z)
        } else {
            this.controls.moveForward(-dz)
        }
    }

    moveForward(dt) {
        this.velocity.z = Math.max(-maxV, this.velocity.z - dt * a)
    }

    moveBackward(dt) {
        this.velocity.z = Math.min(maxV, this.velocity.z + dt * a)
    }

    moveLeft(dt) {
        this.velocity.x = Math.max(-maxV, this.velocity.x - dt * a)
    }

    moveRight(dt) {
        this.velocity.x = Math.min(maxV, this.velocity.x + dt * a)
    }


    //Set up the instructions
    setupCapture() {
        document.body.addEventListener('click', () => this.controls.lock())
    }


    //Handle key down event
    onKeyDown(event) {
        if (!this.controls.isLocked) return
        Object.keys(this.keyMap).filter((it) => {
            if (this.keyMap[it].key === event.code) {
                this.keyMap[it].value = true
            }
        })
    };

    //Handle key up event
    onKeyUp(event) {
        if (!this.controls.isLocked) return

        Object.keys(this.keyMap).filter((it) => {
            if (this.keyMap[it].key === event.code) {
                this.keyMap[it].value = false
            }
        })
    };
}