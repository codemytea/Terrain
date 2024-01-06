import {Scene} from "./Scene";
import {WorldTerrain} from "../Level1/WorldTerrain";
import {DUSTY_EVENING_SKY, MORNING_SKY, Sky} from "./Sky";
import {WaterSphere} from "../Level2/WaterSphere";
import {Lights} from "./Lights";
import {House} from "../Level1/House";
import {LumpyRock} from "../Level1/Rock";
import {Grass} from "../Level1/Grass";




const world = new WT2()
let s1 = new Scene([
     world,
     new Sky(DUSTY_EVENING_SKY),
     ...world.getRandomTrees(0.01),
     //...world.getRandomRocks(0.3),
     new WaterSphere(),
     new Lights()

 ], -5300, 300)

const scene1World = new WT1()

let s2 = new Scene([
    scene1World,
    ...scene1World.getRandomTrees(0.003),
    //...scene1World.getRandomRocks(0.3),
    new Grass(),
    new Sky(DUSTY_EVENING_SKY),
    new Lights(),
    new House()

], 200, 50)

s1.display()




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