import { Fighter } from '../objects/Fighter';
import { GameObjects, Scene } from 'phaser';

export class Squirrel extends Fighter {
    protected climbUpKey: Phaser.Input.Keyboard.Key;
	protected climbDownKey: Phaser.Input.Keyboard.Key;
    protected angleLeftKey: Phaser.Input.Keyboard.Key;
	protected angleRightKey: Phaser.Input.Keyboard.Key;
	protected throwKey: Phaser.Input.Keyboard.Key;
    protected anim: Phaser.Tweens.Tween[];
    protected pointer: Phaser.GameObjects.Sprite;

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
            Phaser.Input.Keyboard.KeyCodes.UP
        );
        this.climbDownKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.DOWN
		);
        this.angleLeftKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.LEFT
        );
        this.angleRightKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.RIGHT
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

        this.pointer = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, 'pointer');
        this.scene.add.existing(this.pointer);
        this.pointer.setScale(.25, .25);
        this.pointer.setOrigin(0,0.5);
    }

    protected handleThrowOver(): void {
        this.throwTimer.reset({ delay: 750, callback: this.handleThrowOver, callbackScope: this, repeat: 1});
        this.isThrowing = false;
        this.nextAmmo = 'acorn';
	}

    update(): void {
        super.update();
        this.pointer.x = this.x;
        this.pointer.y = this.y;
	}

    protected handleMove(): void {
        if (this.climbUpKey.isDown) {
            this.climb(-300);
		} else if (this.climbDownKey.isDown) {
            this.climb(300);
        } else if (this.climbDownKey.isUp && this.climbUpKey.isUp && this.isClimbing) {
            this.isClimbing = false;
        }

        if (this.angleLeftKey.isDown && this.shootAngle > -90) {
            this.shootAngle -= 10;
		} else if (this.angleRightKey.isDown && this.shootAngle < 90) {
            this.shootAngle += 10;
        }
        this.pointer.angle = this.shootAngle;

		if (this.throwKey.isDown && !this.isThrowing) {
			this.isThrowing = true;
			this.throw();
		}
    }

	public getHit(): void {
		console.log('i\'m hit - squirrel');
	}
}
