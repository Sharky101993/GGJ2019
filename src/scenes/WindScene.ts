import { Bird } from '../objects/Bird';
import { Pipe } from '../objects/Pipe';
import { Truck } from '../objects/Truck';

export class WindScene extends Phaser.Scene {
    // objects
    private bird: Bird;
    private truck: Truck;
    private pipes: Phaser.GameObjects.Group;
    private bg: Phaser.GameObjects.TileSprite;

    // variables
    private timer: Phaser.Time.TimerEvent;
    private score: number;
    private scoreText: Phaser.GameObjects.Text;
    private hp: number;
    private impactSound: Phaser.Sound.BaseSound;

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
        this.score = -1;
        this.hp = 5;
        this.impactSound = this.sound.add('level1ImpactRock');
    }

    create(): void {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.bg.setScale(4);

        this.scoreText = this.add.text(14, 30, '0', {
            fontFamily: 'Cavalcade-Shadow',
            fontSize: 40
        });

        this.scoreText.setDepth(2);

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
            key: 'truck'
        });
        this.physics.add.collider(this.bird, this.truck, this.endWindScene, null, this);

        // Add bird
        this.add.existing(this.bird);
        // Add truck
        this.add.existing(this.truck);
    }

    update(): void {
        this.bird.update();
    }

    private hitObstacle(): void {
        this.impactSound.play();
        this.hp--;
        this.scoreText.setText('' + this.hp);
        if (this.hp <= 0) {
            this.restartGame();
        }
    }

    private endWindScene(): void {
        this.scene.start('DrivingLevel', {hp: this.hp});
    }

    private addRocks(): void {
        // update the score
        this.score += 1;
        this.scoreText.setText('' + this.hp);
        const rockPositions = [[29, 262], [193, 104], [456, 195], [577, 270], [185, 576], [241, 516], [286, 464], [321, 362], [394, 430], [486, 464], [614, 497], [115, 222], [615, 122], [615, 192], [615, 192], [750, 450]];
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
        this.scene.start('MainMenu');
    }
}
