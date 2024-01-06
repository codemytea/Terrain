import * as THREE from 'three';
import {fragShader, vertexShader} from "./GrassShaders";
import {getRandomFloat} from "../Shared/utils";

export class Grass{
    grassMesh;

    grassProperties = {
        grassWidth: 0.4,
        grassHeight: 0.8,
        heightVariation: 0.6,
        grassMaterial: new THREE.ShaderMaterial({
            uniforms: {
                textures: {value: [ new THREE.TextureLoader().load('../Assets/grass.png')]},
                iTime: { type: 'f', value: 0.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragShader,
            vertexColors: true,
        })
    }

    constructor() {

        const positions = [];
        const uvs = [];
        const indices = [];
        const colors = [];

        for (let i = 0; i < 1000000; i++) {

            const pos = new THREE.Vector3(getRandomFloat(50, 100), 0, getRandomFloat(50, 100));

            const uv = [
                this.convertRange(pos.x, -50, 50, 0, 1),
                this.convertRange(pos.z, -50, 50, 0, 1)
            ]

            const blade = this.generateBlade(pos, i * 5, uv);

            positions.push(...blade.verts.flatMap(vert => vert.pos));
            uvs.push(...blade.verts.flatMap(vert => vert.uv));
            colors.push(...blade.verts.flatMap(vert => vert.color));
            indices.push(...blade.indices);
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();

        this.grassMesh = new THREE.Mesh(geom, this.grassProperties.grassMaterial);

    }

    generateBlade(center, vArrOffset, uv) {
        const { grassWidth, grassHeight, heightVariation } = this.grassProperties;

        const midpoint = grassWidth * 0.5;

        const height = grassHeight + Math.random() * heightVariation;
        const tipBend = Math.random() * Math.PI * 2;

        const getYawUnitVector = () => new THREE.Vector3(Math.sin(Math.random() * Math.PI * 2), 0, -Math.cos(Math.random() * Math.PI * 2));

        const verts = [
            {
                pos: center.clone().addScaledVector(getYawUnitVector(), grassWidth / 2).toArray(),
                uv,
                color: [0, 0, 0]
            },
            {
                pos: center.clone().addScaledVector(getYawUnitVector(), -(grassWidth / 2)).toArray(),
                uv,
                color: [0, 0, 0]
            },
            {
                pos: center.clone().addScaledVector(getYawUnitVector(), -(midpoint / 2)).add(new THREE.Vector3(0, height / 2, 0))   .toArray(),
                uv,
                color: [0.5, 0.5, 0.5]
            },
            {
                pos: center.clone().addScaledVector(getYawUnitVector(), midpoint / 2).add(new THREE.Vector3(0, height / 2, 0)).toArray(),
                uv,
                color: [0.5, 0.5, 0.5]
            },
            {
                pos: center.clone().addScaledVector(new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend)), 0.1).add(new THREE.Vector3(0, height, 0)).toArray(),
                uv,
                color: [1.0, 1.0, 1.0]
            }
        ];

        const indices = [
            vArrOffset, vArrOffset + 1, vArrOffset + 2,
            vArrOffset + 2, vArrOffset + 4, vArrOffset + 3,
            vArrOffset + 3, vArrOffset, vArrOffset + 2
        ];

        return { verts, indices };
    }


    convertRange (val, oldMin, oldMax, newMin, newMax) {
        return (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
    }

    add(scene){
        scene.add(this.grassMesh)
    }

    onNewFrame(delta){
        this.grassProperties.grassMaterial.uniforms.iTime.value = delta;
    }

}