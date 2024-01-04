import {Scene} from "./Scene";
import {WorldTerrain} from "./WorldTerrain";
import {Sky} from "./Sky";
import {WaterSphere} from "./WaterSphere";
import {Lights} from "./Lights";




const world = new WorldTerrain()
new Scene([
    world,
    new Sky(),
    ...world.getRandomTrees(0.07),
    new WaterSphere(),
    new Lights()

]).display()




/**
 * TODO:
 *
 * Add volumetric fog
 * Add textures to silt and water and snow
 * Add clouds
 *
 * Make blender model of trees and rocks
 * add to world
 *
 * add physics - cannot go into world or tree etc
 * add flying camera only x above planet
 *
 * read on tiling perlin noise - modulo?
 * */