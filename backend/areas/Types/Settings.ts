export default class Settings {
    musicVolume = 1.0;
    sfxVolume = 1.0;
    voicesVolume = 1.0;

    setMusicVolume(vol: number) {
        this.musicVolume = Math.max(0, Math.min(1, vol));
    }
    setSfxVolume(vol: number) {
        this.sfxVolume = Math.max(0, Math.min(1, vol));
    }
    setVoicesVolume(vol: number) {
        this.voicesVolume = Math.max(0, Math.min(1, vol));
    }
}