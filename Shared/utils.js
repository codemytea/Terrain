export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max){
    return Math.random() * max - min
}


//todo fix
export function getRandomXYZAvoiding(number, normal, avoidingBox) {
    const x = Math.random() * number - normal; //-50, 50
    if (x > avoidingBox[0]-normal && x < avoidingBox[1]-normal ) { //x>-10 && x<10
        // The x-coordinate is in the box we want to avoid
        if (Math.random() >= 0.5) {
            // Choose a random side for the z to be on
            return [x, 0, Math.random() * avoidingBox[0] - normal]; //-50, -10
        } else {
            return [x, 0, number - (Math.random() * (number-avoidingBox[1]))- normal]; //10, 50
        }
    }

    return [x, 0, Math.random() * number - normal];
}




