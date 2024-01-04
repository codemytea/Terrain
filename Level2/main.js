import {Scene} from "./Scene";
import {WorldTerrain} from "./WorldTerrain";
import {Sky} from "./Sky";
import {WaterSphere} from "./WaterSphere";
import {Lights} from "./Lights";




const world = new WorldTerrain()
new Scene([
    world,
    new Sky(),
    ...world.getRandomTrees(0.03),
    ...world.getRandomRocks(0.3),
    new WaterSphere(),
    new Lights()

]).display()




/**
 * TODO:
 *
 * deal with shadows
 * deal with rocks exporting too high res
 * deal with rocks appearing above terrain
 *
 * deal with jerky - make planet smaller? isaacs mesh?
 *
 * add camera fly x high
 * */