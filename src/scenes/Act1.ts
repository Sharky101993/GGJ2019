export class Act1 extends Phaser.Scene {
    // objects
    private startKey: Phaser.Input.Keyboard.Key;
    private dialogue: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: 'Act1'
        });
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
    }

    create(): void {
        this.dialogue = new Phaser.GameObjects.Sprite(this, 400, 500, 'dialogue');
        this.add.existing(this.dialogue);
    }

    update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.scene.start('WindScene');
        }
    }
}
