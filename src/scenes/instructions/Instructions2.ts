/**
 * Main menu.
 */
export class Instructions2 extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private bg: Phaser.GameObjects.TileSprite;
    private music: Phaser.Sound.BaseSound;
    private enterButton: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: 'Instructions2'
        });
    }

    init(data): void {
        this.data = data;
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.music = this.sound.add('instructionsTheme', {loop: true, volume: 0.05});
    }

    create() {
        this.music.play();
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'instructions2');
        this.enterButton = new Phaser.GameObjects.Sprite(this, 750, 550, 'enter', 0);
        this.add.existing(this.enterButton);
        this.anims.create({
            key: 'enterAnim',
            frames: [ { key: 'enter', frame: 0 }, { key: 'enter', frame: 1 } ],
            frameRate: 2,
            repeat: -1
        });
    }

    update() {
        this.enterButton.anims.play('enterAnim', true);
        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.add.tween({
                targets: this.music,
                volume: 0,
                duration: 300,
                onComplete: () => {
                    this.music.stop();
                    this.music.destroy();
                    this.scene.start('DrivingLevel', this.data);
                },
            });
        }
    }
}
