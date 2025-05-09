export default function skipTo(currentScene: Phaser.Scene, nextScene: string, beforeNext?: () => void) {
    currentScene.input.keyboard!.on('keydown-ESC', (event: Event) => {
        launchNext(event, currentScene)
    });
    currentScene.input.keyboard!.on('keydown-SPACE', (event: Event) => {
        launchNext(event, currentScene)
    });

    
    
    const launchNext = async (event: Event, currentScene: Phaser.Scene) => {
        event.preventDefault();
        if (beforeNext) {
            await beforeNext();
          }
        currentScene.scene.launch(nextScene)
    }
}