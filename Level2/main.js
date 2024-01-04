import {Scene} from "./Scene";
import {WorldTerrain} from "./WorldTerrain";
import {Sky} from "./Sky";




const world = new WorldTerrain()
new Scene([
    world,
    new Sky(),
    ...world.getRandomTrees(0.07)

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