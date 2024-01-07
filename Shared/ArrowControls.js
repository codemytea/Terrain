import * as THREE from "../External Libraries/three/three.module.js";

// Constants for velocity, acceleration, and gravity
const maxV = 6;
const a = 11;
const g = 10;

const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);

/**
 * ArrowControls class provides arrow key-based controls for camera movement and rotation in a 3D scene.
 */
export class ArrowControls {
    /** Three.js camera object used for navigation. */
    camera;

    /** Object holding control states for movement and rotation. */
    controls;

    /** Velocity object for forward and leftward movement. */
    velocity = {forward: 0, left: 0};

    /** Flags indicating key states for movement and rotation. */
    left = false;
    right = false;
    forwards = false;
    backwards = false;
    rotateLeft = false
    rotateRight = false
    rotateUp = false
    rotateDown = false

    clock = new THREE.Clock()

    currentPhi

    /** Raycaster object for collision detection with the ground. */
    raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), 0, 100);

    constructor(cameraStart, world) {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        let sphericalPosition = new THREE.Spherical(1020, -Math.PI + 0.1, 0)
        let cartesianPosition = new THREE.Vector3().setFromSphericalCoords(sphericalPosition.radius, sphericalPosition.phi, sphericalPosition.theta)
        this.camera.position.set(cartesianPosition.x, cartesianPosition.y, cartesianPosition.z)
        let rotation = this.camera.rotation

        this.camera.rotation.set(sphericalPosition.phi, sphericalPosition.theta, rotation.z)
        this.currentPhi = sphericalPosition.phi
        this.world = world

        // Add event listeners for keydown and keyup events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    add(scene) {
        //scene.add(this.controls.getObject());
    }

    /**
     * Decelerates the camera based on gravity and updates velocity.
     * @param {number} dt - The time elapsed since the last frame.
     */
    decelerate(dt) {
        let a = g
        if (this.velocity.forward > 0) {
            this.velocity.forward = Math.max(0, this.velocity.forward - a * dt)
        } else {
            this.velocity.forward = Math.min(0, this.velocity.forward + a * dt)
        }

        if (this.velocity.left > 0) {
            this.velocity.left = Math.max(0, this.velocity.left - a * dt)
        } else {
            this.velocity.left = Math.min(0, this.velocity.left + a * dt)
        }

    }

    /**
     * Retrieves the distance from the camera to the ground.
     * @returns {Promise<number>} A promise that resolves to the distance from the camera to the ground.
     */
    async getDistanceFromGround() {
        let pos = this.camera.getWorldPosition(new THREE.Vector3())
        this.raycaster.set(pos, new THREE.Vector3(-pos.x, -pos.y, -pos.z).normalize())
        let inwardIntersections = this.raycaster.intersectObject(this.world, false).sort((a, b) => a.distance - b.distance)

        if (inwardIntersections.length === 0) {
            return 0
        }
        return inwardIntersections[0].distance
    }

    signPhi = -1
    signTheta = 1

    /**
     * Updates camera position, velocity, and rotation based on keyboard input.
     */
    async onNewFrame() {
        let dt = this.clock.getDelta()

        this.decelerate(dt)

        let dViewLR = 0
        let dViewUD = 0
        if (this.left) this.onLeft(dt)
        if (this.right) this.onRight(dt)
        if (this.backwards) this.onBackward(dt)
        if (this.forwards) this.onForward(dt)
        if (this.rotateLeft) dViewLR += dt / (Math.PI)
        if (this.rotateRight) dViewLR -= dt / (Math.PI)
        if (this.rotateUp) dViewUD += dt / (Math.PI)
        if (this.rotateDown) dViewUD -= dt / (Math.PI)

        let dr = -await this.getDistanceFromGround()

        let pos = this.camera.position
        let sphericalPos = new THREE.Spherical().setFromCartesianCoords(pos.x, pos.y, pos.z)

        let newR = sphericalPos.radius + dr + 40

        this.camera.position.setFromSphericalCoords(newR, sphericalPos.phi, sphericalPos.theta)

        let facingForward = this.camera.getWorldDirection(new THREE.Vector3()).normalize().multiplyScalar(this.velocity.forward)
        let position = this.camera.getWorldPosition(new THREE.Vector3()).normalize()
        let facingLeft = new THREE.Vector3(0, 0, 0)
        let oldPos = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z)
        this.camera.position.set(facingForward.x + facingLeft.x + oldPos.x, facingForward.y + facingLeft.y + oldPos.y, facingForward.z + facingLeft.z + oldPos.z)
        let newPos = this.camera.position
        let oldPosSpherical = new THREE.Spherical().setFromCartesianCoords(oldPos.x, oldPos.y, oldPos.z)
        let newPosSpherical = new THREE.Spherical().setFromCartesianCoords(newPos.x, newPos.y, newPos.z)

        let dTheta = newPosSpherical.theta - oldPosSpherical.theta
        let dPhi = newPosSpherical.phi - oldPosSpherical.phi


        if (Math.abs(dTheta) < 1) {
            this.camera.rotateOnWorldAxis(yAxis, dTheta * this.signTheta)
        } else {
            this.signPhi = -this.signPhi
        }

        if (Math.abs(dPhi) < 1) {
            this.camera.rotateOnWorldAxis(xAxis, this.signPhi * dPhi)
        } else {
            this.signTheta = -this.signTheta
        }
    }

    /**
     * Handles key input for rightward movement.
     * @param {number} dt - The time elapsed since the last frame.
     */
    onRight(dt) {
        this.velocity.left = Math.max(-maxV, this.velocity.left - dt * a)
    }

    /**
     * Handles key input for backward movement.
     * @param {number} dt - The time elapsed since the last frame.
     */
    onBackward(dt) {
        this.velocity.forward = Math.max(-maxV, this.velocity.forward - dt * a)
    }

    /**
     * Handles key input for forward movement.
     * @param {number} dt - The time elapsed since the last frame.
     */
    onForward(dt) {
        this.velocity.forward = Math.min(maxV, this.velocity.forward + dt * a)
    }

    /**
     * Handles key input for leftward movement.
     * @param {number} dt - The time elapsed since the last frame.
     */
    onLeft(dt) {
        this.velocity.left = Math.min(maxV, this.velocity.left + dt * a)
    }

    /**
     * Handles keydown event for updating control states.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
                return this.forwards = true;
            case 'ArrowLeft':
                return this.left = true;
            case 'ArrowDown':
                return this.backwards = true;
            case 'ArrowRight':
                return this.right = true;
            case 'KeyA':
                return this.rotateLeft = true;
            case 'KeyD':
                return this.rotateRight = true;
            case 'KeyW':
                return this.rotateUp = true;
            case 'KeyS':
                return this.rotateDown = true;
        }
    };

    /**
     * Handles keyup event for updating control states.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
                return this.forwards = false;
            case 'ArrowLeft':
                return this.left = false;
            case 'ArrowDown':
                return this.backwards = false;
            case 'ArrowRight':
                return this.right = false;
            case 'KeyA':
                return this.rotateLeft = false;
            case 'KeyD':
                return this.rotateRight = false;
            case 'KeyW':
                return this.rotateUp = false;
            case 'KeyS':
                return this.rotateDown = false;
        }
    };
}
