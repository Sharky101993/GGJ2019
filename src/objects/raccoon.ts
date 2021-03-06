import { Projectile } from '../objects/Projectile';
import { Fighter } from './Fighter';

enum RaccoonState {
    Throw = 'throw',
    Shield = 'shield'
};
export class Raccoon extends Fighter {
    private changeDirectionTimer: Phaser.Time.TimerEvent;
    // if false moving right
    private isClimbingUp: Boolean;
    private shield: Phaser.GameObjects.Sprite;
    private trashCanHit: Phaser.Sound.BaseSound;
    private raccoonCry: Phaser.Sound.BaseSound;
    private raccoonHit: Phaser.Sound.BaseSound;

    public state: RaccoonState = RaccoonState.Shield;

    constructor(params) {
        super(params);

        this.body.setSize(80, 70);

		this.isClimbingUp = true;

        this.changeDirectionTimer = params.scene.time.addEvent(
            {delay: 750,
            callback: this.handleDirectionChange,
            callbackScope: this,
            loop: false,
        });

        this.shield = new Shield({
            scene: this.scene,
            x: this.x,
            y: this.y,
            key: 'shield'
        });
        //this.shield.setSize(60, 10);
        this.shield.setAngle(-45);
        this.shield.setScale(.75);
        this.shield.setDepth(10);
        // add pipe to scene
        this.scene.add.existing(this.shield);

        this.hp = 5;

        this.shootAngle = -135;
        
        this.trashCanHit = this.scene.sound.add('level3TrashCanHit');
        this.raccoonCry = this.scene.sound.add('level3RaccoonCry');
        this.raccoonHit = this.scene.sound.add('level3RaccoonHit');
    }

    protected handleShieldOver(): void {
        this.throwTimer.reset({ delay: 500, callback: this.handleThrowOver, callbackScope: this, repeat: 1});
        this.nextAmmo = Phaser.Math.Between(0,1) % 2 ? 'sandwich' : 'trash';
        this.throw();
        this.shield.x = this.x + 30;
        this.shield.setAngle(65);
        this.state = RaccoonState.Throw;
    }
    
    protected handleThrowOver(): void {
        this.throwTimer.reset({ delay: 1000, callback: this.handleShieldOver, callbackScope: this, repeat: 1});
        this.shield.x = this.x - 20;
        this.shield.setAngle(-45);
        this.state = RaccoonState.Shield;
    }

    private handleDirectionChange(): void {
        this.changeDirectionTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleDirectionChange, callbackScope: this, repeat: 1});
        this.isClimbingUp = !this.isClimbingUp;
    }

    update(): void {
        super.update();
        this.shield.y = this.y - 10;
        
	}

    protected handleMove(): void {
        this.magnitude = Phaser.Math.Between(600, 700);
        this.shootAngle = Phaser.Math.Between(170, 225);
    }

	public getHit(): void {
        if (this.state === RaccoonState.Throw) {
            this.raccoonCry.play();
            this.raccoonHit.play();
            this.hp--;
            if (this.hp <= 0) {
                // this.scene.scene.start('Act4');
                this.endGameWithScene('Act4');
            }
        } else {
            this.trashCanHit.play();
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
class Shield extends Phaser.GameObjects.Sprite {
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
    }
}