export function settingsListener(currentScene: Phaser.Scene) {
    currentScene.input.keyboard!.on('keydown-ESC', (event: Event) => {
        event.preventDefault();
        currentScene.scene.pause();
        currentScene.scene.launch('Settings', { previousSceneKey: currentScene.scene.key})
    });
}