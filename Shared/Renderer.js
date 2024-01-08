import * as THREE from "../External Libraries/three/three.module.js";

/**
 * The Renderer class provides a singleton instance of THREE.WebGLRenderer for rendering 3D scenes.
 * It initializes the renderer with shadow mapping capabilities and sets its size to match the window dimensions.
 */
export class Renderer {
    /** The singleton instance of the Renderer class. */
    static instance = new Renderer();

    /**
     * Constructs a Renderer object and initializes the THREE.WebGLRenderer with shadow mapping.
     * The renderer is set to fill the entire window.
     */
    constructor() {
        this.renderer = new THREE.WebGLRenderer({antialias:true});

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        // Set the renderer size to match the window dimensions
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer's DOM element to the document body
        document.body.appendChild(this.renderer.domElement);
    }
}
