export function ambientSound(filename, volume) {
    const sound = new Audio(filename)
    sound.play()
    sound.volume = volume
    sound.addEventListener('ended', () => ambientSound(filename, volume))
    return sound
}

export function stopSound(audio) {
    audio.pause()
}

export let toStopSound = {value: null};