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
    protected acornThrow: Phaser.Sound.BaseSound;
    protected squirrelCry: Phaser.Sound.BaseSound;
    protected squirrelHit: Phaser.Sound.BaseSound;

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

        this.acornThrow = this.scene.sound.add('level3AcornThrow');
        this.squirrelCry = this.scene.sound.add('level3SquirrelCry');
        this.squirrelHit = this.scene.sound.add('level3SquirrelHit');
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
            this.shootAngle -= 3;
		} else if (this.angleRightKey.isDown && this.shootAngle < 90) {
            this.shootAngle += 3;
        }
        this.pointer.angle = this.shootAngle;

		if (Phaser.Input.Keyboard.JustDown(this.throwKey) && !this.isThrowing) {
			this.isThrowing = true;
            this.acornThrow.play();
			this.throw();
		}
    }

	public getHit(): void {
        this.hp--;
        this.squirrelHit.play();
        this.squirrelCry.play();
        if (this.hp <= 0) {
            // this.scene.scene.start('MainMenu');
            this.endGameWithScene('MainMenu');
        }
	}

    private endGameWithScene(scene): void {
        this.scene.add.tween({
            targets: this.music,
            volume: 0,
            duration: 300,
            onComplete: () => {
                this.music.destroy();
                this.scene.scene.start(scene);
            },
        })
    }
}
