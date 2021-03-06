export class Bird extends Phaser.GameObjects.Sprite {
    private anim: Phaser.Tweens.Tween[];
    private wind: Phaser.GameObjects.Sprite;
    private pointer;
    private dragXStart: number = -1;
    private dragYStart: number = -1;
    private windSound: Phaser.Sound.BaseSound;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setOrigin(0.5, 0.5);

        // audio
        this.windSound = params.scene.sound.add('level1WindGust');

        // physics
        params.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(0);
        this.body.setSize(62, 42);
        this.body.collideWorldBounds = true;

        this.wind = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'wind');
        this.scene.add.existing(this.wind);
        this.wind.alpha = 0;

        // input
        this.pointer = params.scene.input.activePointer;
    }

    update(): void {
        this.handleInput();
    }

    private handleInput(): void {
        if (this.pointer.isDown) {
            if (this.dragXStart < 0) {
                this.dragXStart = this.pointer.x;
                this.dragYStart = this.pointer.y;
                this.wind.x = this.dragXStart;
                this.wind.y = this.dragYStart;
            } else {
                const diffX = this.pointer.x - this.dragXStart;
                const diffY = this.pointer.y - this.dragYStart;
                const diff = Math.sqrt(diffX * diffX + diffY * diffY);
                this.wind.setAngle(Math.atan(diffY / diffX) * 180 / Math.PI + (diffX < 0 ? 180 : 0));
                this.wind.alpha = (Math.abs(diffX) > 0 || Math.abs(diffY) > 0) ? 1 : 0;
                this.wind.alpha = diff / 400 + 0.1;
            }
        }
        if (!this.pointer.isDown && this.dragXStart >= 0) {
            this.wind.alpha = 0;
            const diffX = this.pointer.x - this.dragXStart;
            const diffY = this.pointer.y - this.dragYStart;
            const diff = Math.sqrt(diffX * diffX + diffY * diffY);
            const multiplier = diff > 0 ? Math.max(1, 200 / diff) : 1;
            this.body.velocity.x += diffX * multiplier;
            this.body.velocity.y += diffY * multiplier;
            this.wiggle(8);
            this.dragXStart = -1;
            this.dragYStart = -1;
            this.windSound.play();
        }
        if (this.body.velocity.x !== 0) {
            this.body.velocity.x *= 0.99;
        }
        if (this.body.velocity.y !== 0) {
            this.body.velocity.y *= 0.99;
        }
    }

    private wiggle(angle): void {
        if (this.body.velocity.length() > 20) {
            this.scene.add.tween({
                targets: this,
                duration: 20000 / this.body.velocity.length(),
                onComplete: () => {
                    this.wiggle(-angle);
                },
                angle: angle
            })
        }
    }
}
