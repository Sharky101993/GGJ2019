import { Bird } from '../objects/Bird';
import { Pipe } from '../objects/Pipe';
import { Squirrel } from '../objects/Squirrel';
import { Raccoon } from '../objects/Racoon';
import { Projectile } from '../objects/Projectile';

export class FightScene extends Phaser.Scene {
    // objects
    private bird: Bird;
    private squirrel: Squirrel;
    private raccoon: Raccoon;
    private pipes: Phaser.GameObjects.Group;
    private acorns: Phaser.GameObjects.Group;
    private bg: Phaser.GameObjects.TileSprite;

    // variables
    private timer: Phaser.Time.TimerEvent;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: 'FightScene'
        });
    }

    init(): void {
        // objects
        this.bird = null;
        this.pipes = this.add.group({ classType: Pipe });
		this.acorns = this.add.group({classType: Projectile, runChildUpdate: true});
        this.squirrel = null;
        this.bg = null;

        // variables
        this.timer = undefined;
        this.score = -1;
    }

    create(): void {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.bg.setScale(4);

        this.scoreText = this.add.text(this.sys.canvas.width / 2 - 14, 30, 'FIGHT!', {
            fontFamily: 'Cavalcade-Shadow',
            fontSize: 40
        });

        this.scoreText.setDepth(2);


        this.bird = new Bird({
            scene: this,
            x: 50,
            y: 100,
            key: 'bird'
        });

        this.raccoon = new Raccoon({
            scene: this,
            x: 650,
            y: 100,
            key: 'raccoon'
        })

        this.squirrel = new Squirrel({
            scene: this,
            x: 50,
            y: 100,
            key: 'squirrel',
            enemy: this.raccoon
        })

        // Add squirrel
        this.add.existing(this.squirrel);

        // Add raccoon
        this.add.existing(this.raccoon);
    }

    update(): void {
        if (!this.squirrel.getDead()) {
            this.bg.tilePositionX -= 1;
            this.squirrel.update();
        }

        if (!this.raccoon.getDead()) {
            this.raccoon.update();
        }
    }

    private restartGame(): void {
        this.scene.start('MainMenu');
    }
}
