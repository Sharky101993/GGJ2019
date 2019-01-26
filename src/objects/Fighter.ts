import { Projectile } from '../objects/Projectile';
import { GameObjects } from 'phaser';
export class Fighter extends Phaser.GameObjects.Sprite {
    protected isClimbing: boolean = false;
	protected isThrowing: boolean = false;
	protected throwTimer;

	public projectiles: GameObjects.Group;
	public enemy: Fighter;

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
        //this.slowDown();
        this.handleMove();
		this.scene.physics.overlap(this.enemy, this.projectiles, this.handleHitEnemy, null, this.scene);
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
        if (this.body.velocity.y !== 0) {
			this.body.setVelocityY(0 - (this.body.velocity.y / 2) );
        }
    }

    protected handleMove(): void {
       //
    }

	public getHit(): void {
		console.log('hit');
	}

    public climb(delta): void {
        this.isClimbing = true;
        delta = Math.min(600,Math.max(0,(this.y + delta))) - this.y;
        this.body.setVelocityY(delta);
    }
	
	public throw(): void{
		let projectile = new Projectile({
			scene: this.scene,
			key: 'sandwich',
			visible: true
		});
		this.projectiles.add(projectile);
		this.scene.add.existing(projectile);
		projectile.fire(this, {x: -600, y: -150});
	}
}
