import { Projectile } from '../objects/Projectile';
import { GameObjects } from 'phaser';
export class Fighter extends Phaser.GameObjects.Sprite {
    protected isClimbing: boolean = false;
	protected isThrowing: boolean = true;
    protected throwTimer;
    protected nextAmmo: string = 'sandwich';
    protected climbAnim: Phaser.Tweens.Tween;

    public projectiles: GameObjects.Group;
    public isFacingRight: boolean = false;
	public enemy: Fighter;

	public setEnemy(enemy): void {
		this.enemy = enemy;
	}

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(1);
        this.setOrigin(0.5, 0.5);

        // physics
        params.scene.physics.world.enable(this);
		this.body.allowGravity = false;
        this.body.setSize(80, 70);
		this.body.colideWorldBounds = true;
		
		this.enemy = params.enemy;
		this.projectiles = this.scene.add.group({classType: Projectile});

		this.throwTimer = params.scene.time.addEvent({
            delay: 750,
            callback: this.handleThrowOver,
            callbackScope: this,
            loop: false,
        });
    }
	
    protected handleThrowOver(): void {
        //this.throwTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleThrowOver, callbackScope: this, repeat: 1});
	}

	protected handleHitEnemy(enemy, trash): void {
		this.projectiles.remove(trash, true, true);
		enemy.getHit();
	}

    update(): void {
        this.slowDown();
        this.handleMove();
		this.scene.physics.overlap(this.enemy, this.projectiles, this.handleHitEnemy, null, this);
		this.handleItemsOffScreen();
	}

    protected handleItemsOffScreen(): void {
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
        handler(this.projectiles);
    }

    protected slowDown(): void {
       this.body.setVelocityY(0);
    }

    protected handleMove(): void {
       //
    }

	public getHit(): void {
		console.log('hit');
	}

    private wiggle(angle): void {
        this.climbAnim = this.scene.add.tween({
            targets: this,
            duration: 100,
            onComplete: () => {
                if (this.isClimbing) {
                    this.wiggle(-1*angle);
                }
            },
            angle: angle
        })
    }

    public climb(velocity): void {
        if (!this.isClimbing) {
            this.wiggle(20);
        }
        this.isClimbing = true;
        if (velocity > 0 &&  this.y <= 500 || velocity < 0 && this.y >= 50) {
            this.body.setVelocityY(velocity);
        }
    }
	
	public throw(): void{
		let projectile = new Projectile({
			scene: this.scene,
			key: this.nextAmmo,
			visible: true
		});
		this.projectiles.add(projectile);
		this.scene.add.existing(projectile);
		projectile.fire(this, {x: this.isFacingRight ? 600 : -600 , y: -150});
	}
}
