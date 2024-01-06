import {Scene} from "./Scene";
import {WorldTerrain as WT1} from "../Level1/WorldTerrain";
import {WorldTerrain as WT2} from "../Level2/WorldTerrain";
import {DUSTY_EVENING_SKY, Sky} from "./Objects/Sky";
import {WaterSphere} from "../Level2/WaterSphere";
import {Lights} from "./Objects/Lights";
import {House} from "../Level1/House";
import {Grass} from "../Level1/Grass";

/*************************LEVEL 1 - FLAT GRASSY PLANE***********************/
const startingWorld = new WT1()

let level1 = new Scene([
    startingWorld,
    ...startingWorld.getRandomTrees(0.0009),
    ...startingWorld.getRandomRocks(0.003),
    new Grass(),
    new Sky(DUSTY_EVENING_SKY),
    new Lights(),
    new House()

], [0, 5, 20], 10)



/*************************LEVEL 2 - FULL WORLD SPHERE***********************/
const fullWorld = new WT2()
let level2 = new Scene(
    [
    fullWorld,
     new Sky(DUSTY_EVENING_SKY),
     ...fullWorld.getRandomTrees(0.01),
     new WaterSphere(),
     new Lights()
    ],
    [0, 0,-5300],
    300
)



level1.display()




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