import { Projectile } from '../objects/Projectile';
import { Raccoon } from '../objects/Raccoon';
import { GameObjects, Scene } from 'phaser';

export class Squirrel extends Phaser.GameObjects.Sprite {
    private climbUpKey: Phaser.Input.Keyboard.Key;
	private climbDownKey: Phaser.Input.Keyboard.Key;
	private throwKey: Phaser.Input.Keyboard.Key;
    private anim: Phaser.Tweens.Tween[];
    private isDead: boolean = false;
	private isClimbing: boolean = false;
	private isThrowing: boolean = false;
	private throwTimer;
	
	public acorns: GameObjects.Group;
	public enemy: Raccoon;

    public getDead(): boolean {
        return this.isDead;
    }

    public setDead(dead): void {
        this.isDead = dead;
    }

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        // image
        this.setScale(1);
        this.setOrigin(0, 0);

        // physics
		params.scene.physics.world.enable(this);
		this.body.allowGravity = false;
        this.body.setSize(60, 60);
		this.body.colideWorldBounds = true;
        // animations & tweens
        this.anim = [
            // params.scene.tweens.add({
            //     targets: this,
            //     duration: 100,
            //     angle: -20
            // })
		];

		this.enemy = params.enemy;
		this.acorns = this.scene.add.group({classType: Projectile});

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

    private handleThrowOver(): void {
        this.throwTimer.reset({ delay: 750, callback: this.handleThrowOver, callbackScope: this, repeat: 1});
        this.isThrowing = false;
	}

	private handleHitRaccoon(raccoon, trash): void {
		this.acorns.remove(trash, true, true);
	}

    update(): void {
        this.slowDown();
		this.handleInput();
		this.scene.physics.overlap(this.enemy, this.acorns, this.handleHitRaccoon, null, this.scene);
		this.handleItemsOffScreen();
	}

    private handleItemsOffScreen(): void {
        const handler = (group) => {
            Phaser.Actions.Call(
                group.getChildren(),
                function(child: Phaser.GameObjects.Sprite) {
                    if (child.y >= 700) {
                        group.remove(child, true, true);
                    }
                },
                this
            );   
        }
        handler(this.acorns);
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
		
		if (this.throwKey.isDown && !this.isThrowing) {
			this.isThrowing = true;
			this.throw();
		}
    }

    public climb(delta): void {
        this.isClimbing = true;
        this.body.setVelocityY(delta);
        //this.anim[0].restart();
	}
	
	public throw(): void{
		let acorn = new Projectile({
			scene: this.scene,
			key: 'sandwich',
			visible: true
		});
		this.acorns.add(acorn);
		this.scene.add.existing(acorn);
		acorn.fire(this, {x: 300, y: -300});
	}

    // private isOffTheScreen(): void {
    //     if (this.y + this.height > this.scene.sys.canvas.height) {
    //         this.isDead = true;
    //     }
    // }
}
