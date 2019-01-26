import { Projectile } from '../objects/Projectile';
import { Fighter } from './Fighter';
export class Raccoon2 extends Fighter {
    private changeDirectionTimer: Phaser.Time.TimerEvent;
    // if false moving right
    private isClimbingUp: Boolean;

    constructor(params) {
        super(params);

        this.body.setSize(80, 70);

		this.isClimbingUp = true;

        this.changeDirectionTimer = params.scene.time.addEvent({
            delay: 750,
            callback: this.handleDirectionChange,
            callbackScope: this,
            loop: false,
        });
    }
	
    protected handleThrowOver(): void {
        this.throwTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleThrowOver, callbackScope: this, repeat: 1});
        this.throw();
	}

    private handleDirectionChange(): void {
        this.changeDirectionTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleDirectionChange, callbackScope: this, repeat: 1});
        this.isClimbingUp = !this.isClimbingUp;
    }

    update(): void {
        super.update();
	}

    protected handleMove(): void {
        this.climb(this.isClimbingUp ? -300 : 300);
    }

	public getHit(): void {
		console.log('i\'m hit - raccoon');
	}
}
