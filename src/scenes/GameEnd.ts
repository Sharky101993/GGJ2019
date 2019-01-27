/**
 * Main menu.
 */
export class GameEnd extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private bg: Phaser.GameObjects.TileSprite;
    private titleText: Phaser.GameObjects.Sprite;
    private titleText2: Phaser.GameObjects.Sprite;
    private readyToFinish: boolean;
    private music: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'GameEnd'
        });
    }

    init() {
        this.readyToFinish = false;
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.music = this.sound.add('titleTheme', {loop: true, volume: 0.5});
    }

    create() {
        this.music.play();
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'closeBg');
        this.titleText = new Phaser.GameObjects.Sprite(this, this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 150, 'close1');
        this.titleText2 = new Phaser.GameObjects.Sprite(this, this.sys.canvas.width / 2, this.sys.canvas.height / 2 - 150, 'close2');
        this.add.existing(this.titleText);
        this.add.existing(this.titleText2);

        this.titleText2.alpha = 0;
        this.time.delayedCall(2000, this.endAnimation, null, this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.startKey) && this.readyToFinish) {
            this.add.tween({
                targets: this.music,
                volume: 0,
                duration: 300,
                onComplete: () => {
                    this.music.stop();
                    this.music.destroy();
                    this.scene.start('MainMenu');
                },
            });
        }
    }

    endAnimation() {
        this.add.tween({
            targets: this.titleText2,
            duration: 1500,
            alpha: 1,
            onComplete: () => {
                this.readyToFinish = true;
            },
        });
    }
}
