export default function useDb(scene: Phaser.Scene) {
    scene.load.setBaseURL('http://localhost:3000');          
    scene.load.setPath('assets');
    setTimeout(() => {}, 1000);
};