export default function skipTo(currentScene: Phaser.Scene, nextScene: string) {
    currentScene.input.keyboard!.on('keydown-ESC', (event: Event) => {
        event.preventDefault();
        currentScene.scene.launch(nextScene)
    });
}