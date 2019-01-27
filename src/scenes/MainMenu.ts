/**
 * Main menu.
 */
export class MainMenu extends Phaser.Scene {
    private startWindKey: Phaser.Input.Keyboard.Key;
    private startFightKey: Phaser.Input.Keyboard.Key;
    private startDrivingKey: Phaser.Input.Keyboard.Key;
    private startKey: Phaser.Input.Keyboard.Key;
    private texts: Phaser.GameObjects.Text[];

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
    }

    create() {
        this.texts = [];
        this.texts.push(
            this.add.text(
                this.sys.canvas.width / 2 - 300,
                this.sys.canvas.height / 2 - 80,
                'WHERE YOUR HAT IS',
                {
                    fontFamily: 'Cavalcade-Shadow',
                    fontSize: 60,
                }
            )
        );
    }

    update() {
        if (this.startFightKey.isDown) {
            this.scene.start('FightScene', {hp: 5});
        }
        if (this.startDrivingKey.isDown) {
            this.scene.start('DrivingLevel', {hp: 5});
        }
        if (this.startWindKey.isDown) {
            this.scene.start('WindScene', {hp: 5});
        }
        if (this.startKey.isDown) {
            this.scene.start('Act1');
        }
    }
}
