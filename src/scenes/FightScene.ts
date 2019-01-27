import { Bird } from '../objects/Bird';
import { Pipe } from '../objects/Pipe';
import { Squirrel } from '../objects/Squirrel';
import { Raccoon } from '../objects/Raccoon';
import { Projectile } from '../objects/Projectile';

export class FightScene extends Phaser.Scene {
    // objects
    private bird: Bird;
    private squirrel: Squirrel;
    private raccoon: Raccoon;
    private pipes: Phaser.GameObjects.Group;
    private acorns: Phaser.GameObjects.Group;
    private bg: Phaser.GameObjects.TileSprite;
    private trashCan: Phaser.GameObjects.Sprite;

    // variables
    private timer: Phaser.Time.TimerEvent;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private hp: number;

    constructor() {
        super({
            key: 'FightScene'
        });
    }

    init(data): void {
        // objects
        this.hp = data.hp;
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
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'fightingLevelBackground');
        this.bg.setScale(1);
        this.bg.tilePositionX += 50;

        this.scoreText = this.add.text(this.sys.canvas.width / 2 - 300, 30, 'TAKE OUT THAT \'COON GOON!', {
            fontFamily: 'Cavalcade-Shadow',
            fontSize: 40
        });

        this.scoreText.setDepth(2);

        this.raccoon = new Raccoon({
            scene: this,
            x: 670,
            y: 420,
            key: 'raccoon'
        })

        this.squirrel = new Squirrel({
            scene: this,
            x: 70,
            y: 100,
            key: 'squirrel',
            enemy: this.raccoon
        })

        this.trashCan = new Phaser.GameObjects.Sprite(
            this,
            675,
            490,
            'can'
        );

        this.add.existing(this.trashCan);
        this.trashCan.setDepth(20);
        this.trashCan.setScale(.75);

        this.raccoon.setEnemy(this.squirrel);

        // Add squirrel
        this.add.existing(this.squirrel);

        // Add raccoon
        this.add.existing(this.raccoon);
    }

    update(): void {
        this.squirrel.update();
        this.raccoon.update();
    }

    private restartGame(): void {
        this.scene.start('MainMenu');
    }
}
