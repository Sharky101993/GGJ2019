import { Fighter } from '../objects/Fighter';
import { GameObjects, Scene } from 'phaser';

export class Squirrel extends Fighter {
    protected climbUpKey: Phaser.Input.Keyboard.Key;
	protected climbDownKey: Phaser.Input.Keyboard.Key;
	protected throwKey: Phaser.Input.Keyboard.Key;
    protected anim: Phaser.Tweens.Tween[];

    constructor(params) {
        super(params);

        this.body.setSize(60, 60);
        this.isFacingRight = true;
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
        this.throwKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
		);

		this.throwTimer = params.scene.time.addEvent({
            delay: 750,
            callback: this.handleThrowOver,
            callbackScope: this,
            loop: false,
        });
    }

    protected handleThrowOver(): void {
        this.throwTimer.reset({ delay: 750, callback: this.handleThrowOver, callbackScope: this, repeat: 1});
        this.isThrowing = false;
	}

    update(): void {
        this.slowDown();
        super.update();
	}

    protected handleMove(): void {
        if (this.climbUpKey.isDown) {
			this.climb(-200);
		} else if (this.climbDownKey.isDown) {
            this.climb(200);
        } else if (this.climbDownKey.isUp && this.climbUpKey.isUp && this.isClimbing) {
            this.isClimbing = false;
		}
		
		if (this.throwKey.isDown && !this.isThrowing) {
			this.isThrowing = true;
			this.throw();
		}
    }

	public getHit(): void {
		console.log('i\'m hit - squirrel');
	}
}
