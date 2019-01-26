export class Bird extends Phaser.GameObjects.Sprite {
    private anim: Phaser.Tweens.Tween[];
    private isDead: boolean = false;
    private isFlapping: boolean = false;
    private pointer;
    private dragXStart: number = -1;
    private dragYStart: number = -1;

    public getDead(): boolean {
        return this.isDead;
    }

    public setDead(dead): void {
        this.isDead = dead;
    }

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(3);
        this.setOrigin(0, 0);

        // physics
        params.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(0);
        this.body.setSize(17, 12);
        this.body.collideWorldBounds = true;

        // input
        this.pointer = params.scene.input.activePointer;
    }

    update(): void {
        this.handleInput();
    }

    private handleInput(): void {
        if (this.pointer.isDown && this.dragXStart < 0) {
            this.dragXStart = this.pointer.x;
            this.dragYStart = this.pointer.y;
        }
        if (!this.pointer.isDown && this.dragXStart >= 0) {
            const diffX = this.pointer.x - this.dragXStart;
            const diffY = this.pointer.y - this.dragYStart;
            const diff = Math.sqrt(diffX * diffX + diffY * diffY);
            const multiplier = diff > 0 ? Math.max(1, 200 / diff) : 1;
            this.body.velocity.x += diffX * multiplier;
            this.body.velocity.y += diffY * multiplier;
            this.dragXStart = -1;
            this.dragYStart = -1;
        }
        if (this.body.velocity.x !== 0) {
            this.body.velocity.x *= 0.99;
        }
        if (this.body.velocity.y !== 0) {
            this.body.velocity.y *= 0.99;
        }
    }

    public flap(): void {
        this.isFlapping = true;
        this.body.setVelocityY(-350);
        this.anim[0].restart();
    }
}
