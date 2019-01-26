/**
 * Main menu.
 */
export class MainMenu extends Phaser.Scene {
    private startWindKey: Phaser.Input.Keyboard.Key;
    private startFightKey: Phaser.Input.Keyboard.Key;
    private startDrivingKey: Phaser.Input.Keyboard.Key;
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private texts: Phaser.GameObjects.Text[] = [];

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
    }

    create() {
        this.texts.push(
            this.add.text(
                this.sys.canvas.width / 2 - 135,
                this.sys.canvas.height / 2 - 80,
                'FLOPPY BIRD',
                {
                    'fontFamily': 'Cavalcade-Shadow',
                    fontSize: 40
                }
            ),
            this.add.text(
                100,
                this.sys.canvas.height / 2 - 10,
                'S: PLAY FIGHT\nD: PLAY DRIVING\nF: PLAY WIND',
                {
                    fontFamily: 'Cavalcade-Shadow',
                    fontSize: 30
                }
            )
        );
    }

    update() {
        if (this.startFightKey.isDown) {
            this.scene.start('FightScene');
        }
        if (this.startDrivingKey.isDown) {
            this.scene.start('DrivingLevel');
        }
        if (this.startWindKey.isDown) {
            this.scene.start('WindScene');
        }
    }
}
