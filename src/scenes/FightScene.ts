import { Bird } from '../objects/Bird';
import { Pipe } from '../objects/Pipe';
import { Squirrel } from '../objects/Squirrel';
import { Raccoon } from '../objects/Racoon';

export class FightScene extends Phaser.Scene {
    // objects
    private bird: Bird;
    private squirrel: Squirrel;
    private raccoon: Raccoon;
    private pipes: Phaser.GameObjects.Group;
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

        this.squirrel = new Squirrel({
            scene: this,
            x: 50,
            y: 100,
            key: 'squirrel'
        })

        this.raccoon = new Raccoon({
            scene: this,
            x: 600,
            y: 100,
            key: 'raccoon'
        })

        // Add bird
        this.add.existing(this.bird);

        // Add squirrel
        this.add.existing(this.squirrel);

    }

    update(): void {
        if (!this.squirrel.getDead()) {
            this.bg.tilePositionX -= 1;
            this.squirrel.update();
        }
    }

    private restartGame(): void {
        this.scene.start('MainMenu');
    }
}
