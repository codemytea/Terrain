import * as THREE from "../External Libraries/three/three.module.js";
import {fragShader, vertexShader} from "./GrassShaders.js";
import {getRandomXYZAvoiding} from "../Shared/utils.js";

/**
 * Makes grass Buffer geometry. Uses shaders in Grass Shaders
 * */
export class Grass {
    grassMesh;

    // Default properties of the grass
    grassProperties = {
        grassWidth: 0.4,
        grassHeight: 0.8,
        heightVariation: 0.6,
        // ShaderMaterial with required uniforms and shaders
        grassMaterial: new THREE.ShaderMaterial({
            uniforms: {
                textures: {value: [new THREE.TextureLoader().load('../Assets/grass.png')]},
                delta: {type: 'f', value: 0.0}
            },
            vertexShader: vertexShader,
            fragmentShader: fragShader,
            vertexColors: true,
        })
    }

    constructor() {
        const positions = [];
        const textureColours = [];
        const indices = [];
        const colours = [];

        // Loop to create grass blades
        for (let i = 0; i < 1000000; i++) {
            // Generate a random position for each grass blade while avoiding the cottage
            const vector = getRandomXYZAvoiding(100, 50, [38, 62])

            // Create a Vector3 instance to represent the position of the grass blade
            const position = new THREE.Vector3(vector[0], vector[1], vector[2]);

            // Function to convert position coordinates to UV coordinates
            const convertRange = (val, oldMin, oldMax, newMin, newMax) => (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;

            // Calculate UV coordinates based on the position
            const uv = [
                convertRange(position.x, -50, 50, 0, 1),
                convertRange(position.z, -50, 50, 0, 1)
            ]

            // Create a grass blade and retrieve its vertices, indices, and colors
            const blade = this.createBlade(position, i * 5, uv);

            // Push the blade's information into the respective arrays
            positions.push(...blade.verts.flatMap(vert => vert.position));
            textureColours.push(...blade.verts.flatMap(vert => vert.uv));
            colours.push(...blade.verts.flatMap(vert => vert.color));
            indices.push(...blade.indices);
        }

        // Create a BufferGeometry for the grassy plane
        const grassyPlane = new THREE.BufferGeometry();
        grassyPlane.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        grassyPlane.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(textureColours), 2));
        grassyPlane.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colours), 3));
        grassyPlane.setIndex(indices);
        grassyPlane.computeVertexNormals();

        // Create the grass mesh using the defined properties and material
        this.grassMesh = new THREE.Mesh(grassyPlane, this.grassProperties.grassMaterial);
    }

    /**
     * Function to create a single blade of grass
     *
     * @param center center of the grass
     * @param offsets the grasses' offsets
     * @param uv texture coordinates
     *
     * @return object containing the blade's vertices and indices
     * */
    createBlade(center, offsets, uv) {
        // Retrieve grass properties for convenience
        const {grassWidth, grassHeight, heightVariation} = this.grassProperties;

        // Calculate random height and tip bend for the grass blade
        const height = grassHeight + Math.random() * heightVariation;
        const tipBend = Math.random() * Math.PI * 2;

        // Function to generate a random yaw unit vector
        const getYawUnitVector = () => new THREE.Vector3(Math.sin(Math.random() * Math.PI * 2), 0, -Math.cos(Math.random() * Math.PI * 2));

        // Define the vertices of the grass blade with positions, UV coordinates, and colors
        const verts = [
            {
                position: center.clone().addScaledVector(getYawUnitVector(), grassWidth / 2).toArray(),
                uv,
                color: [0, 0, 0]
            },
            {
                position: center.clone().addScaledVector(getYawUnitVector(), -(grassWidth / 2)).toArray(),
                uv,
                color: [0, 0, 0]
            },
            {
                position: center.clone().addScaledVector(getYawUnitVector(), -(grassWidth * 0.5 / 2)).add(new THREE.Vector3(0, height / 2, 0)).toArray(),
                uv,
                color: [0.5, 0.5, 0.5]
            },
            {
                position: center.clone().addScaledVector(getYawUnitVector(), grassWidth * 0.5 / 2).add(new THREE.Vector3(0, height / 2, 0)).toArray(),
                uv,
                color: [0.5, 0.5, 0.5]
            },
            {
                position: center.clone().addScaledVector(new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend)), 0.1).add(new THREE.Vector3(0, height, 0)).toArray(),
                uv,
                color: [1.0, 1.0, 1.0]
            }
        ];

        // Define indices for drawing triangles
        const indices = [
            offsets, offsets + 1, offsets + 2,
            offsets + 2, offsets + 4, offsets + 3,
            offsets + 3, offsets, offsets + 2
        ];

        return {verts, indices};
    }

    add(scene) {
        scene.add(this.grassMesh)
    }

    onNewFrame(delta) {
        this.grassProperties.grassMaterial.uniforms.delta.value = delta;
    }
}
