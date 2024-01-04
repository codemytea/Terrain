class TerrainType{
    constructor(heightFrom, heightTo, texture) {
        this.heightFrom = heightFrom;
        this.heightTo = heightTo;
        this.texture = texture
    }

    getTexture(){
        return this.texture;
    }
}