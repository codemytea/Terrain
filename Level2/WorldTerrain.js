import * as THREE from "three";
import {SimplexNoise} from "three/addons";
import {noise} from "./perlin";
import {getRandomInt} from "./utils";
import {Spherical} from "three";
import {Tree} from "./Tree";
import {FlatRock, LumpyRock, NormalRock} from "./Rock";

export class WorldTerrain{
    material;
    mesh;
    r;
    world;

    constructor() {
        this.r = 5000
        this.world = new THREE.SphereGeometry(this.r, 600, 600);
        const vertexPositions = this.world.getAttribute('position').array;
        const vertexNormals = this.world.getAttribute('normal').array;

        const simplex = new SimplexNoise();
        let temp = getRandomInt(500, 600)


        for (let i = 0; i < vertexPositions.length; i += 3) {

            let relativeVertexPosition = simplex.noise3d(vertexPositions[i]/temp, vertexPositions[i+1]/temp, vertexPositions[i+2]/temp);
            // Extend the vertex along its normal
            vertexPositions[i] += vertexNormals[i] * relativeVertexPosition * 150;
            vertexPositions[i + 1] += vertexNormals[i + 1] * relativeVertexPosition * 150;
            vertexPositions[i + 2] += vertexNormals[i + 2] * relativeVertexPosition * 150;
            
        }

        this.world.verticesNeedUpdate = true;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                sphereOrigin: { value: new THREE.Vector3(0, 0, 0) }, // Set the sphere's origin
                time: {value: 0},
                fogColor : { value: new THREE.Vector3(1, 1, 1) },
                fogNear : { value: 100.0 },
                fogFar : { value: 1000.0 },
                fogNoiseSpeed: {value: 0.1},
                fogNoiseFrequency: {value: 0.003},
                fogNoiseImpact: {value: 0.5},
                fogDensity: {value: 0.0006}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        this.mesh = new THREE.Mesh(this.world, this.material);
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.mesh.position.set(0, 0, 0)
    }

    onNewFrame(delta){
        this.material.uniforms.time.value += delta;
    }

    add(scene){
        scene.add(this.mesh);
    }
    
    getPositions(minHeight, maxHeight){
        const vertexPositions = this.world.attributes.position;
        let sphericalPositions = []
        for (let i = 0; i < vertexPositions.count; i ++) {
            let vertex = new THREE.Vector3().fromBufferAttribute(vertexPositions, i)
            sphericalPositions.push(
                new Spherical().setFromCartesianCoords(vertex.x, vertex.y, vertex.z)
            )
        }
        return sphericalPositions.filter((pos)=> pos.radius - this.r > minHeight && pos.radius - this.r < maxHeight)
    }

    getRandomTrees(treesPerPosition){
        let positions = this.getPositions(10, 200)
        let numberOfTrees = positions.length * treesPerPosition
        let trees = []
        for(let i = 0; i<Math.min(numberOfTrees, positions.length); i++){
            let randIndex = getRandomInt(0, positions.length - 1)
            let randPos = positions[randIndex]
            trees.push(new Tree(randPos.radius, randPos.theta, randPos.phi, getRandomInt(3, 20)))
            positions.splice(randIndex, 1)
        }
        return trees

    }

    getRandomRocks(rocksPerPosition){
        let positions = this.getPositions(-20, -5)
        let numberOfTrees = positions.length * rocksPerPosition
        let trees = []
        for(let i = 0; i<Math.min(numberOfTrees, positions.length); i+=3){
            let randIndex = getRandomInt(0, positions.length - 1)
            let randPos = positions[randIndex]
            trees.push(new LumpyRock(randPos.radius, randPos.theta, randPos.phi, getRandomInt(1, 2)))
            positions.splice(randIndex, 1)

            randIndex = getRandomInt(0, positions.length - 1)
            randPos = positions[randIndex]
            trees.push(new NormalRock(randPos.radius, randPos.theta, randPos.phi, getRandomInt(1, 2)))
            positions.splice(randIndex, 1)

            randIndex = getRandomInt(0, positions.length - 1)
            randPos = positions[randIndex]
            trees.push(new FlatRock(randPos.radius, randPos.theta, randPos.phi, getRandomInt(1, 2)))
            positions.splice(randIndex, 1)
        }
        return trees
    }
}


const vertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
    ${noise}
    uniform vec3 sphereOrigin;
    uniform vec3 fogColor;
    uniform float fogStart;
    uniform float fogEnd;
    uniform float time;
    uniform float fogNoiseSpeed;
    uniform float fogNoiseFrequency;
    uniform float fogNoiseImpact;
    uniform float fogDensity;
    
    varying vec3 vPosition;

    const float minRiverDistance = 4800.0;
    const float maxRiverDistance = 4949.0;
    
    const float minSiltDistance = 4949.0;
    const float maxSiltDistance = 4950.0;
    
    const float minMossDistance = 4950.0;
    const float maxMossDistance = 5030.0;
    
    const float minSoilDistance = 5030.0;
    const float maxSoilDistance = 5200.0;
    
    const float minSnowDistance = 5200.0;
    const float maxSnowDistance = 6000.0;
    
    vec3 hexToVec3(float r, float g, float b) {
        return vec3(r / 255.0, g / 255.0, b / 255.0);
    }


    void main() {
        float distance = length(vPosition - sphereOrigin);
        float cameraDistance = length(vPosition - cameraPosition);
        
        vec3 windDir = vec3(0.0, 0.0, time);
        vec3 scrollingPos = vPosition + fogNoiseSpeed * windDir;
        float noise = cnoise(fogNoiseFrequency * scrollingPos.xyz);
        float vFogDepth = (1.0 - fogNoiseImpact * noise) * cameraDistance;
        float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
      
        vec3 riverColour = hexToVec3(56.0, 77.0, 71.0);
        vec3 siltColour = hexToVec3(107.0, 116.0, 120.0);
        vec3 mossColour = hexToVec3(124.0, 142.0, 81.0);
        vec3 soilColour = hexToVec3(65.0, 65.0, 65.0);
        vec3 snowColour = hexToVec3(56.0, 116.0, 71.0);
    
        float tRiver = smoothstep(minRiverDistance, maxRiverDistance, distance);
        float tSilt = smoothstep(minSiltDistance, maxSiltDistance, distance);
        float tMoss = smoothstep(minMossDistance, maxMossDistance, distance);
        float tSoil = smoothstep(minSoilDistance, maxSoilDistance, distance);
        float tSnow = smoothstep(minSnowDistance, maxSnowDistance, distance);
    
        vec3 colour = mix(riverColour, siltColour, tRiver);
        colour = mix(colour, mossColour, tSilt);
        colour = mix(colour, soilColour, tMoss);
        colour = mix(colour, snowColour, tSoil);

        // Apply fog color
        vec3 foggedColor = mix(colour, fogColor, fogFactor);

        gl_FragColor = vec4(foggedColor, 1.0);
    }
`;