/**
 * Main menu.
 */
export class GameEnd extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private texts: Phaser.GameObjects.Text[];
    private readyToFinish: boolean;

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
    }

    create() {
        this.texts = [];
        this.texts.push(
            this.add.text(
                this.sys.canvas.width / 2 - 100,
                this.sys.canvas.height / 2 - 150,
                'HOME IS',
                {
                    'fontFamily': 'Cavalcade-Shadow',
                    fontSize: 60,
                }
            ),
            this.add.text(
                this.sys.canvas.width / 2 - 300,
                this.sys.canvas.height / 2 - 80,
                'WHERE YOUR HAT IS',
                {
                    'fontFamily': 'Cavalcade-Shadow',
                    fontSize: 60,
                }
            )
        );
        this.texts[0].alpha = 0;
        this.time.delayedCall(2000, this.endAnimation, null, this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.startKey) && this.readyToFinish) {
            this.scene.start('MainMenu');
        }
    }

    endAnimation() {
        this.add.tween({
            targets: this.texts[0],
            duration: 1500,
            alpha: 1,
            onComplete: () => {
                this.readyToFinish = true;
            },
        });
    }
}
