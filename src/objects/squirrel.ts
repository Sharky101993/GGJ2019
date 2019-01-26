export class Squirrel extends Phaser.GameObjects.Sprite {
    private climbUpKey: Phaser.Input.Keyboard.Key;
    private climbDownKey: Phaser.Input.Keyboard.Key;
    private anim: Phaser.Tweens.Tween[];
    private isDead: boolean = false;
    private isClimbing: boolean = false;

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
        this.body.setSize(17, 12);

        // animations & tweens
        this.anim = [
            // params.scene.tweens.add({
            //     targets: this,
            //     duration: 100,
            //     angle: -20
            // })
        ];

        // input
        this.climbUpKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );
        this.climbDownKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
    }

    update(): void {
        this.slowDown();
        this.handleInput();
    }

    private slowDown(): void {
        if (this.body.velocity.y !== 0) {
			this.body.setVelocityY(0 - (this.body.velocity.y / 2) );
        }
    }

    private handleInput(): void {
        if (this.climbUpKey.isDown) {
			this.climb(-200);
		} else if (this.climbDownKey.isDown) {
            this.climb(200);
        } else if (this.climbDownKey.isUp && this.climbUpKey.isUp && this.isClimbing) {
            this.isClimbing = false;
        }
    }

    public climb(delta): void {
        this.isClimbing = true;
        this.body.setVelocityY(delta);
        //this.anim[0].restart();
    }

    // private isOffTheScreen(): void {
    //     if (this.y + this.height > this.scene.sys.canvas.height) {
    //         this.isDead = true;
    //     }
    // }
}
