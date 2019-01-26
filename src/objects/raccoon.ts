import { Projectile } from '../objects/Projectile';
import { GameObjects } from 'phaser';
export class Raccoon extends Phaser.GameObjects.Sprite {
	private climbUpKey: Phaser.Input.Keyboard.Key;
    private climbDownKey: Phaser.Input.Keyboard.Key;
    private anim: Phaser.Tweens.Tween[];
    private isDead: boolean = false;
    private isClimbing: boolean = false;
	private isThrowing: boolean = false;
	private throwTimer;
	
    private changeDirectionTimer: Phaser.Time.TimerEvent;
    // if false moving right
    private isClimbingUp: Boolean;

	public acorns: GameObjects.Group;
	public enemy: Raccoon;

    public getDead(): boolean {
        return this.isDead;
    }

    public setDead(dead): void {
        this.isDead = dead;
    }

	public setEnemy(enemy): void {
		this.enemy = enemy;
	}

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(1);
        this.setOrigin(0, 0);

        // physics
        params.scene.physics.world.enable(this);
		this.body.allowGravity = false;
        this.body.setSize(80, 70);
		this.body.colideWorldBounds = true;

        this.isClimbingUp = true;

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
		this.throwTimer = params.scene.time.addEvent({
            delay: 750,
            callback: this.handleThrowOver,
            callbackScope: this,
            loop: false,
        });
        this.changeDirectionTimer = params.scene.time.addEvent({
            delay: 750,
            callback: this.handleDirectionChange,
            callbackScope: this,
            loop: false,
        });
    }

    private handleDirectionChange(): void {
        this.changeDirectionTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleDirectionChange, callbackScope: this, repeat: 1});
        this.isClimbingUp = !this.isClimbingUp;
    }
	
    private handleThrowOver(): void {
        this.throwTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleThrowOver, callbackScope: this, repeat: 1});
		this.throw();
	}

	private handleHitSquirrel(squirrel, trash): void {
		this.acorns.remove(trash, true, true);
	}

    update(): void {
        this.slowDown();
        this.handleMove();
		this.scene.physics.overlap(this.enemy, this.acorns, this.handleHitSquirrel, null, this.scene);
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

    private handleMove(): void {
        if (this.climbUpKey.isDown) {
			this.climb(-200);
		} else if (this.climbDownKey.isDown) {
            this.climb(200);
        } else if (this.climbDownKey.isUp && this.climbUpKey.isUp && this.isClimbing) {
            this.isClimbing = false;
        }
    }

	public getHit(): void {
		console.log('hit');
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
		acorn.fire(this, {x: -300, y: -300});
	}
}
