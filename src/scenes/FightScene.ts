import { Bird } from '../objects/Bird';
import { Pipe } from '../objects/Pipe';
import { Squirrel } from '../objects/Squirrel';
import { Raccoon } from '../objects/Raccoon';
import { Projectile } from '../objects/Projectile';

export class FightScene extends Phaser.Scene {
    private hpBar: Phaser.GameObjects.Sprite;
    private health: Phaser.GameObjects.Sprite;
    private hpBarBg: Phaser.GameObjects.Sprite;
    private raccoonHealthBar: Phaser.GameObjects.Sprite;
    private raccoonHealth: Phaser.GameObjects.Sprite;
    private raccoonBarBg: Phaser.GameObjects.Sprite;

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
    private hp: number;
    private music: Phaser.Sound.BaseSound;

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
        this.music = this.sound.add('level3Music', {volume: 0.5});
    }

    create(): void {
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'fightingLevelBackground');
        this.bg.setScale(1);
        this.bg.tilePositionX += 50;
        this.music.play();

        this.raccoon = new Raccoon({
            scene: this,
            x: 670,
            y: 420,
            key: 'raccoon'
        })

        this.squirrel = new Squirrel({
            scene: this,
            x: 70,
            y: 500,
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
        
        this.hpBarBg = new Phaser.GameObjects.Sprite(this, 51, 17, 'bar_bg');
        this.add.existing(this.hpBarBg);
        this.health = new Phaser.GameObjects.Sprite(this, 51, 17, 'health');
        this.add.existing(this.health);
        this.hpBarBg.displayWidth = 160;
        this.health.displayHeight = this.hpBarBg.displayHeight = 37;
        this.hpBarBg.setOrigin (0, 0);
        this.health.setOrigin (0, 0);
        this.hpBar = new Phaser.GameObjects.Sprite(this, 110, 40, 'hp');
        this.hpBar.displayWidth = 202;
        this.hpBar.displayHeight = 46;
        this.add.existing(this.hpBar);
        this.health.displayWidth = this.hpBarBg.displayWidth * this.squirrel.hp / 5;
        
        this.raccoonBarBg = new Phaser.GameObjects.Sprite(this, 50, 81, 'bar_bg');
        this.add.existing(this.raccoonBarBg);
        this.raccoonHealth = new Phaser.GameObjects.Sprite(this, 50, 81, 'health');
        this.add.existing(this.raccoonHealth);
        this.raccoonBarBg.displayWidth = 160;
        this.raccoonHealth.displayHeight = this.raccoonBarBg.displayHeight = 37;
        this.raccoonBarBg.setOrigin (0, 0);
        this.raccoonHealth.setOrigin (0, 0);
        this.raccoonHealthBar = new Phaser.GameObjects.Sprite(this, 110, 100, 'raccoon_health');
        this.raccoonHealthBar.displayWidth = 202;
        this.raccoonHealthBar.displayHeight = 37;
        this.add.existing(this.raccoonHealthBar);
        this.raccoonHealth.displayWidth = this.raccoonBarBg.displayWidth * this.raccoon.hp / 5;
    }

    update(): void {
        this.squirrel.update();
        this.raccoon.update();
        this.health.displayWidth = this.hpBarBg.displayWidth * this.squirrel.hp / 5;
        this.raccoonHealth.displayWidth = this.raccoonBarBg.displayWidth * this.raccoon.hp / 5;
    }
}
