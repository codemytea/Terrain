import * as THREE from 'three';
import {fragShader, vertexShader} from "./GrassShaders";
import {getRandomFloat, getRandomXYZAvoiding} from "../Shared/utils";

export class Grass{
    grassMesh;

    grassProperties = {
        grassWidth: 0.4,
        grassHeight: 0.8,
        heightVariation: 0.6,
        grassMaterial: new THREE.ShaderMaterial({
            uniforms: {
                textures: {value: [ new THREE.TextureLoader().load('../Assets/grass.png')]},
                delta: { type: 'f', value: 0.0 }
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

        for (let i = 0; i < 1000000; i++) {
            const vector = getRandomXYZAvoiding(100, 50, [38, 62])

            const position = new THREE.Vector3(vector[0], vector[1], vector[2]);

            const convertRange  = (val, oldMin, oldMax, newMin, newMax) => (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;

            const uv = [
                convertRange(position.x, -50, 50, 0, 1),
                convertRange(position.z, -50, 50, 0, 1)
            ]

            const blade = this.createBlade(position, i * 5, uv);

            positions.push(...blade.verts.flatMap(vert => vert.position));
            textureColours.push(...blade.verts.flatMap(vert => vert.uv));
            colours.push(...blade.verts.flatMap(vert => vert.color));
            indices.push(...blade.indices);
        }

        const grassyPlane = new THREE.BufferGeometry();
        grassyPlane.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        grassyPlane.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(textureColours), 2));
        grassyPlane.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colours), 3));
        grassyPlane.setIndex(indices);
        grassyPlane.computeVertexNormals();

        this.grassMesh = new THREE.Mesh(grassyPlane, this.grassProperties.grassMaterial);

    }

    createBlade(center, offsets, uv) {
        const { grassWidth, grassHeight, heightVariation } = this.grassProperties;
        
        const height = grassHeight + Math.random() * heightVariation;
        const tipBend = Math.random() * Math.PI * 2;

        const getYawUnitVector = () => new THREE.Vector3(Math.sin(Math.random() * Math.PI * 2), 0, -Math.cos(Math.random() * Math.PI * 2));

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

        const indices = [
            offsets, offsets + 1, offsets + 2,
            offsets + 2, offsets + 4, offsets + 3,
            offsets + 3, offsets, offsets + 2
        ];

        return { verts, indices };
    }
    

    add(scene){
        scene.add(this.grassMesh)
    }

    onNewFrame(delta){
        this.grassProperties.grassMaterial.uniforms.delta.value = delta;
    }

}