/**
 * Main menu.
 */
export class Instructions2 extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private bg: Phaser.GameObjects.TileSprite;
    private music: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'Instructions2'
        });
    }

    init() {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.music = this.sound.add('titleTheme', {loop: true, volume: 0.5});
    }

    create() {
        this.music.play();
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'instructions2');
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.add.tween({
                targets: this.music,
                volume: 0,
                duration: 300,
                onComplete: () => {
                    this.music.stop();
                    this.music.destroy();
                    this.scene.start('DrivingLevel');
                },
            });
        }
    }
}
