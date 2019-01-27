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
    private enterButton: Phaser.GameObjects.Sprite;

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
        this.titleText = new Phaser.GameObjects.Sprite(this, this.sys.canvas.width / 2, 400, 'close1');
        this.add.existing(this.titleText);

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
                    this.scene.start('MainMenu');
                },
            });
        }
    }
}
