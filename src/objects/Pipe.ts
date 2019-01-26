export class Pipe extends Phaser.GameObjects.Sprite {
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(3);
        this.setOrigin(0, 0);

        // physics
        params.scene.physics.world.enable(this);
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setVelocityX(0);
        this.body.setSize(20, 20);
        this.body.collideWorldBounds = true;
    }
}
