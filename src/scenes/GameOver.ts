/**
 * Main menu.
 */
export class GameOver extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private texts: Phaser.GameObjects.Text[];
    private readyToFinish: boolean;
    private deadHattley: Phaser.GameObjects.Sprite;
    private music: Phaser.Sound.BaseSound;
    private enterButton: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: 'GameOver'
        });
    }

    init() {
        this.readyToFinish = false;
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.deadHattley = new Phaser.GameObjects.Sprite(this, this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'deadHattley');
        this.deadHattley.setScale(2);
        this.add.existing(this.deadHattley);
        this.music = this.sound.add('gameOver', {volume: 0.7});
    }

    create() {
        this.music.play();
        this.deadHattley.alpha = 0;
        this.texts = [];
        this.texts.push(
            this.add.text(
                this.sys.canvas.width / 2 - 150,
                this.sys.canvas.height / 2 - 150,
                'Game Over',
                {
                    'fontFamily': 'Cavalcade-Shadow',
                    fontSize: 60,
                }
            )
        );
        this.time.delayedCall(300, this.endAnimation, null, this);
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
        if (this.readyToFinish) {
            this.enterButton.alpha = 1;
            this.enterButton.anims.play('enterAnim', true);
        } else {
            this.enterButton.alpha = 0;
        }
        if (Phaser.Input.Keyboard.JustDown(this.startKey) && this.readyToFinish) {
            this.add.tween({
                targets: this.music,
                volume: 0,
                duration: 300,
                onComplete: () => {
                    this.music.destroy();
                    this.scene.start('MainMenu');
                },
            });
        }
    }

    endAnimation() {
        this.add.tween({
            targets: this.deadHattley,
            duration: 1000,
            alpha: 1,
            onComplete: () => {
                this.readyToFinish = true;
            },
        });
    }
}
