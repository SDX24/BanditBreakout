export default function settingsListener(currentScene: Phaser.Scene, isInGame?: boolean) {
    currentScene.input.keyboard!.on('keydown-ESC', (event: Event) => {
        event.preventDefault();
        currentScene.scene.pause();
        if (isInGame) {
            currentScene.scene.launch('Settings', { previousSceneKey: currentScene.scene.key, isInGame: true });
        } else {
            currentScene.scene.launch('Settings', { previousSceneKey: currentScene.scene.key });
        }
    });
}