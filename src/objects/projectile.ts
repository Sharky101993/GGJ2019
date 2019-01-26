export class Projectile extends Phaser.GameObjects.Sprite {
	private born: number = 0;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(1);
        this.setOrigin(0, 0);

        // physics
        params.scene.physics.world.enable(this);
		this.body.setVelocityX(0);
		this.body.setVelocityY(0);
        this.body.setSize(20, 20);
	}

	fire(thrower, dir): void {
		this.setPosition(thrower.x, thrower.y);
		this.body.setVelocityX(dir.x);
		this.body.setVelocityY(dir.y);
	}

	update(time, delta): void {
		this.born += delta;
		if (this.born > 1800) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
}