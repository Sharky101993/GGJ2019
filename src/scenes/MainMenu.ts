/**
 * Main menu.
 */
export class MainMenu extends Phaser.Scene {
    private startWindKey: Phaser.Input.Keyboard.Key;
    private startFightKey: Phaser.Input.Keyboard.Key;
    private startDrivingKey: Phaser.Input.Keyboard.Key;
    private startKey: Phaser.Input.Keyboard.Key;
    private bg: Phaser.GameObjects.TileSprite;
    private titleText: Phaser.GameObjects.Sprite;
    private music: Phaser.Sound.BaseSound;
    private enterButton: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: 'MainMenu'
        });
    }

    init() {
        this.startWindKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.F
        );
        this.startFightKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        this.startDrivingKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.music = this.sound.add('titleTheme', {loop: true, volume: 0.5});
    }

    create() {
        this.music.play();
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'titleBg');
        this.titleText = new Phaser.GameObjects.Sprite(this, this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 150, 'title');
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
        if (this.startFightKey.isDown) {
            this.transitionToScene('FightScene', {hp: 5});
        }
        if (this.startDrivingKey.isDown) {
            this.transitionToScene('DrivingLevel', {hp: 5});
        }
        if (this.startWindKey.isDown) {
            this.transitionToScene('WindScene', {hp: 5});
        }
        if (this.startKey.isDown) {
            this.transitionToScene('Act1', null);
        }
    }

    private transitionToScene(scene, data): void {
        this.add.tween({
            targets: this.music,
            volume: 0,
            duration: 300,
            onComplete: () => {
                this.music.stop();
                this.music.destroy();
                this.scene.start(scene, data);
            },
        })
    }
}
