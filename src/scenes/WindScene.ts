import { Bird } from '../objects/Bird';
import { Pipe } from '../objects/Pipe';
import { Truck } from '../objects/Truck';

export class WindScene extends Phaser.Scene {
    // objects
    private bird: Bird;
    private truck: Truck;
    private pipes: Phaser.GameObjects.Group;
    private bg: Phaser.GameObjects.TileSprite;
    private hpBar: Phaser.GameObjects.Sprite;
    private health: Phaser.GameObjects.Sprite;
    private barBg: Phaser.GameObjects.Sprite;

    // variables
    private timer: Phaser.Time.TimerEvent;
    private hp: number;
    private impactSound: Phaser.Sound.BaseSound;
    private music: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'WindScene'
        });
    }

    init(): void {
        // objects
        this.bird = null;
        this.pipes = this.add.group({ classType: Pipe });
        this.bg = null;

        // variables
        this.timer = undefined;
        this.hp = 5;
        this.impactSound = this.sound.add('level1ImpactRock');
        this.music = this.sound.add('level1Music', {volume: 0.5});
    }

    create(): void {
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'bg_wind');
        this.music.play();

        this.addRocks();

        this.bird = new Bird({
            scene: this,
            x: 50,
            y: 500,
            key: 'chappy_wind'
        });
        this.physics.add.collider(this.bird, this.pipes, this.hitObstacle, null, this);

        this.truck = new Truck({
            scene: this,
            x: 730,
            y: 50,
            key: 'caperCar'
        });
        this.physics.add.collider(this.bird, this.truck, this.endWindScene, null, this);

        // Add bird
        this.add.existing(this.bird);
        // Add truck
        this.add.existing(this.truck);

        this.barBg = new Phaser.GameObjects.Sprite(this, 51, 17, 'bar_bg');
        this.add.existing(this.barBg);
        this.health = new Phaser.GameObjects.Sprite(this, 51, 17, 'health');
        this.add.existing(this.health);
        this.barBg.displayWidth = 160;
        this.health.displayHeight = this.barBg.displayHeight = 37;
        this.barBg.setOrigin (0, 0);
        this.health.setOrigin (0, 0);
        this.hpBar = new Phaser.GameObjects.Sprite(this, 110, 40, 'hp');
        this.hpBar.displayWidth = 202;
        this.hpBar.displayHeight = 46;
        this.add.existing(this.hpBar);
        this.health.displayWidth = this.barBg.displayWidth * this.hp / 5;
    }

    update(): void {
        this.bird.update();
        this.health.displayWidth = this.barBg.displayWidth * this.hp / 5;
    }

    private hitObstacle(): void {
        this.impactSound.play();
        this.hp--;
        if (this.hp <= 0) {
            this.restartGame();
        }
    }

    private endWindScene(): void {
        this.endGameWithScene('Act2', {hp: this.hp});
    }

    private addRocks(): void {
        const rockPositions = [[29, 262], [193, 134], [456, 195], [577, 270], [185, 576], [241, 516], [286, 464], [321, 362], [394, 430], [486, 464], [614, 497], [115, 222], [615, 122], [615, 192], [615, 192], [750, 450]];
        rockPositions.forEach(coords => {
            let pipe = new Pipe({
            scene: this,
            x: coords[0],
            y: coords[1] - 100,
            frame: null,
            key: 'rock'
            })
            // add pipe to group
            this.pipes.add(pipe);

            // add pipe to scene
            this.add.existing(pipe);
        })
    }

    private restartGame(): void {
        this.endGameWithScene('GameOver', null);
    }

    private endGameWithScene(scene, data): void {
        this.add.tween({
            targets: this.music,
            volume: 0,
            duration: 300,
            onComplete: () => {
                this.music.destroy();
                this.scene.start(scene, data);
            },
        })
    }
}
