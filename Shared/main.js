import {Scene} from "./Scene";
import {WorldTerrain} from "../Level1/WorldTerrain";
import {DUSTY_EVENING_SKY, MORNING_SKY, Sky} from "./Sky";
import {WaterSphere} from "../Level2/WaterSphere";
import {Lights} from "./Lights";
import {House} from "../Level1/House";
import {LumpyRock} from "../Level1/Rock";
import {Grass} from "../Level1/Grass";




// const world = new WorldTerrain()
// new Scene([
//     world,
//     new Sky(MIDDAY_SKY),
//     ...world.getRandomTrees(0.03),
//     ...world.getRandomRocks(0.3),
//     new WaterSphere(),
//     new Lights()
//
// ], 5300, 150).display()

const scene1World = new WorldTerrain()

new Scene([
    //scene1World,
    new Grass(),
    new Sky(DUSTY_EVENING_SKY),
    new Lights(),
    //new House(0, 0),
    //new LumpyRock(1, 1, 2)

], 200, 50).display()




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