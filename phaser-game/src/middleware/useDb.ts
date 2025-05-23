export default function useDb(scene: Phaser.Scene) {
    scene.load.setBaseURL(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000');          
    scene.load.setPath('assets');
    setTimeout(() => {}, 1000);
};