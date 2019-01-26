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
    }

    create(): void {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.bg.setScale(4);

        this.scoreText = this.add.text(14, 30, '0', {
            fontFamily: 'Cavalcade-Shadow',
            fontSize: 40
        });

        this.scoreText.setDepth(2);

        this.addRowOfPipes();

        this.bird = new Bird({
            scene: this,
            x: 0,
            y: 500,
            key: 'bird'
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
        if (!this.bird.getDead()) {
            this.bg.tilePositionX -= 1;
            this.bird.update();
        } else {
            Phaser.Actions.Call(
                this.pipes.getChildren(),
                function(pipe) {
                    pipe.body.setVelocityX(0);
                },
                this
            );

            if (this.bird.y > this.sys.canvas.height) {
                this.restartGame();
            }
        }
    }

    private hitObstacle(): void {
        this.hp--;
        this.scoreText.setText('' + this.hp);
        if (this.hp <= 0) {
            this.restartGame();
        }
    }

    private endWindScene(): void {
        this.scene.start('DrivingLevel', {hp: this.hp});
    }

    private addOnePipe(x, y, frame): void {
        // create a pipe at the position x and y
        // let pipe = new Pipe({
        //     scene: this,
        //     x: x,
        //     y: y,
        //     frame: frame,
        //     key: 'pipe'
        // });
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

    private addRowOfPipes(): void {
        // update the score
        this.score += 1;
        this.scoreText.setText('' + this.hp);

        // randomly pick a number between 1 and 5
        let hole = 3;

        // add 6 pipes with one big hole at position hole and hole + 1
        for (let i = 0; i < 10; i++) {
            if (i != hole && i != hole + 1 && i != hole + 2) {
                if (i == hole - 1) {
                    this.addOnePipe(400, i * 60, 0);
                } else if (i == hole + 3) {
                    this.addOnePipe(400, i * 60, 1);
                } else {
                    this.addOnePipe(400, i * 60, 2);
                }
            }
        }
    }

    private restartGame(): void {
        this.scene.start('MainMenu');
    }
}
