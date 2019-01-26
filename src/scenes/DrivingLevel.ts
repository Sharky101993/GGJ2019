/**
 * DrivingLevel
 */

const ITEM_TYPE_BOMB = 'bomb';
const ITEM_TYPE_HAT = 'hat';
const OFFSCREEN_EVENT = 'offscreen-event';
const mphPxScale = 0.65;
const NUM_HATS = 12;

const HATS_TO_WIN = 10;

export class DrivingLevel extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    private texts: Phaser.GameObjects.Text[] = [];
  
    // objects
    private copCar: CopCar;
    private hatterCar: HatterCar;
    private bg: Phaser.GameObjects.TileSprite;
    private bombs: Phaser.GameObjects.Group;
    private hats: Phaser.GameObjects.Group;
    private explosions: Phaser.GameObjects.Group;

    // variables
    private speed: number;
    private numHatHits: number;
    private hatPower: number;

    private hatCountText: Phaser.GameObjects.Text;
    private hatPowerText: Phaser.GameObjects.Text;
    private throwingStuffTimer: Phaser.Time.TimerEvent;

    constructor() {
        super({
            key: 'DrivingLevel'
        });
    }

    init() {
        this.speed = 35;
        this.numHatHits = 0;
        this.hatPower = 5;
        this.bg = null;
        this.bombs = this.add.group({ classType: Bomb });
        this.hats = this.add.group({ classType: Hat });
        this.explosions = this.add.group({ classType: Explosion });
    }

    create() {
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'drivingLevelBackground');
        this.hatCountText = this.add.text(
            10,
            10,
            `Hit: ${this.numHatHits} hats`,
            {
                'fontFamily': 'Cavalcade-Shadow',
                fontSize: 24
            }
        );
        this.hatPowerText = this.add.text(
            10,
            50,
            `Hat Power Left: ${this.hatPower}`,
            {
                'fontFamily': 'Cavalcade-Shadow',
                fontSize: 24
            }
        );
        this.hatCountText.setDepth(10);
        this.hatPowerText.setDepth(11);
        this.copCar = new CopCar({
            scene: this,
            x: 440,
            y: 530,
            key: 'copCar'
        });
        this.add.existing(this.copCar);
        this.hatterCar = new HatterCar({
            scene: this,
            x: this.sys.canvas.width/2,
            y: 90,
            key: 'caperCar'
        });
        this.add.existing(this.hatterCar);
        this.throwingStuffTimer = this.time.addEvent({
            delay: 750,
            callback: this.throwRandomItem,
            callbackScope: this,
            loop: false
        });
    }

    update() {
       this.bg.tilePositionY -= ((this.speed-10)*mphPxScale);
       this.copCar.update();
       this.hatterCar.update();
       this.physics.overlap(this.copCar, this.bombs, this.hitBomb, null, this);
       this.physics.overlap(this.copCar, this.hats, this.hitHat, null, this);
       this.handleItemsOffScreen();
       this.updateExplosions();
    }

    private handleItemsOffScreen(): void {
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
        handler(this.bombs);
        handler(this.hats);
    }

    private throwRandomItem():void {
        if (Math.random() > 0.7) {
            this.throwHat();
        } else {
            this.throwBomb();
        }
        this.throwingStuffTimer.reset({ delay: Phaser.Math.Between(200,750), callback: this.throwRandomItem, callbackScope: this, repeat: 1});
    }

    private throwHat(): void {
        const hatKey = Math.floor(Math.random()*NUM_HATS);
        let hat = new Hat({
            scene: this,
            x: this.hatterCar.x,
            y: this.hatterCar.y,
            key: `hat${hatKey}`,
        });
        this.hats.add(hat);
        this.add.existing(hat);
    }

    private throwBomb(): void {
        let bomb = new Bomb({
            scene: this,
            x: this.hatterCar.x,
            y: this.hatterCar.y,
            key: 'dynamite'
        });
        this.bombs.add(bomb);
        this.add.existing(bomb);
    }

    private objectWithType(object1, object2, type): Phaser.GameObjects.GameObject {
        if (object1.getData('itemType') === type) {
            return object1;
        }
        return object2
    }

    private hitBomb(object1, object2): void {
       const bomb = this.objectWithType(object1, object2, ITEM_TYPE_BOMB);
       this.hatPower--;
       this.hatPowerText.setText(`Hat Power Left: ${this.hatPower}`);
       this.bombs.remove(bomb, true, true);
       // explosion
       const explosion = new Explosion({
        scene: this,
        x: this.copCar.x,
        y: this.copCar.y,
        key: 'hatsplosion',
        });
       this.explosions.add(explosion);
       this.add.existing(explosion);
       this.dropHats();
       if (this.hatPower === 0) {
           this.crazyExplosion(() => {
            this.scene.start('DrivingLevel', this.scene);
           });
       }
    }

    private dropHats(): void {
        for (let i = 0; i < 5; i++) {
            const hatKey = Math.floor(Math.random()*NUM_HATS);
               const hat = new Hat({
                scene: this,
                  x: this.copCar.x,
                 y: this.copCar.y,
                 key: `hat${hatKey}`,
                 randomVelocity: true,
            });
              this.add.existing(hat);
              this.add.tween({
                targets: hat,
                duration: 1500,
                alpha: 0,
                onComplete: (e) => {
                    e.targets.forEach(t => {
                        t.destroy(this);
                    });
                },
            });
        }
        this.numHatHits = 0;
        this.updateHatCountText();
    }

    private updateHatCountText(): void {
        this.hatCountText.setText(`Hit: ${this.numHatHits} hats`);
    }

    private crazyExplosion(callback):void {
        for (let i = 0; i < 100; i++) {
            const randX = Math.floor(Math.random()*800);
             const randY =  Math.floor(Math.random()*600);
               const explosion = new Explosion({
              scene: this,
               x: randX,
              y: randY,
              key: 'hatsplosion',
              dontFixToCar: true,
            });
              this.explosions.add(explosion);
              this.add.existing(explosion);
           }
           this.time.addEvent({
               delay:1000,
               callbackScope:this,
               callback: callback,
           });
    }

    private hitHat(object1, object2) {
        this.numHatHits++;
        this.updateHatCountText();
        if (this.numHatHits === HATS_TO_WIN) {
            const hat = this.objectWithType(object1, object2, ITEM_TYPE_HAT);
            this.hats.remove(hat, true, true);
            this.crazyExplosion(() => {
                this.scene.start('FightScene', this.scene);
            });
        } else {
            const hat = this.objectWithType(object1, object2, ITEM_TYPE_HAT);
            this.hats.remove(hat, false, false);
            this.add.tween({
                targets: hat,
                duration: 1500,
                alpha: 0,
                x: this.copCar.x,
                y: this.copCar.y,
                onComplete: (e) => {
                    e.targets.forEach(t => {
                        t.destroy(this);
                    });
                },
            });
        }
    }

    private updateExplosions() {
        Phaser.Actions.Call(
            this.explosions.getChildren(),
            function(explosion) {
                explosion.update(this.copCar);
            },
            this
        );
    }
}

//
//
// Sprite Objects Below
//
//

class CopCar extends Phaser.GameObjects.Sprite {
    private leftKey: Phaser.Input.Keyboard.Key;
    private rightKey: Phaser.Input.Keyboard.Key;
    private isDead: boolean = false;
    private isFlapping: boolean = false;
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        // image
        this.setScale(0.5);
        // physics
        params.scene.physics.world.enable(this);
       this.body.setSize(100, 280);

       this.body.allowGravity = false;

        // input
        this.leftKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.LEFT
        );
        this.rightKey = params.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.RIGHT
        );
    }

    update(): void {
        this.handleInput();
    }

    private handleInput(): void {
        if (this.leftKey.isDown) {
            this.moveLeft();
        } else if (this.rightKey.isDown) {
            this.moveRight();
        } else if (this.leftKey.isUp && this.rightKey.isUp) {
            this.setAngleAndVelocity(0, 0);
        }
    }

    private setAngleAndVelocity(angle, velocity): void {
        this.setAngle(angle);
        this.body.setVelocityX(velocity);
    }

    private moveLeft(): void {
        if (this.x <= 160) {
            this.setAngleAndVelocity(0, 0);
            return;
        }
        this.setAngleAndVelocity(-15, -400);
    }

    private moveRight(): void {
        if (this.x >= 650) {
            this.setAngleAndVelocity(0, 0);
            return;
        }
        this.setAngleAndVelocity(15, 400);
    }
}

class HatterCar extends Phaser.GameObjects.Sprite {
    private anim: Phaser.Tweens.Tween[];
    private changeDirectionTimer: Phaser.Time.TimerEvent;
    // if false moving right
    private movingLeft: Boolean;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(0.45);
        // physics
        params.scene.physics.world.enable(this);
        this.body.setSize(100, 300);
        // animations & tweens
        this.anim = [
        ];
        this.body.allowGravity = false; 
        this.movingLeft = true;
        this.changeDirectionTimer = params.scene.time.addEvent({
            delay: 750,
            callback: this.handleDirectionChange,
            callbackScope: this,
            loop: false,
        });
    }

    private handleDirectionChange(): void {
        this.changeDirectionTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleDirectionChange, callbackScope: this, repeat: 1});
        this.movingLeft = !this.movingLeft;
    }

    update(): void {
        if (this.movingLeft) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    private setAngleAndVelocity(angle, velocity): void {
        this.setAngle(angle);
        this.body.setVelocityX(velocity);
    }

    private moveLeft(): void {
        if (this.x <= 160) {
            this.setAngleAndVelocity(0, 0);
            return;
        }
        this.setAngleAndVelocity(-15, -280);
    }

    private moveRight(): void {
        if (this.x >= 650) {
            this.setAngleAndVelocity(0, 0);
            return;
        }
        this.setAngleAndVelocity(15, 280);
    }

}

class Bomb extends Phaser.GameObjects.Sprite {
    private anim: Phaser.Tweens.Tween[];

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(1.25);
        this.scene = params.scene;
        // physics
        params.scene.physics.world.enable(this);
        this.body.setSize(25, 40);

        // animations & tweens
        this.anim = [
        ];
    }
}

class Hat extends Phaser.GameObjects.Sprite {
    private anim: Phaser.Tweens.Tween[];

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        // image
        this.scene = params.scene;
        // physics
        params.scene.physics.world.enable(this);
        if (params.randomVelocity) {
            const magnitude = 160;
            const angle = Math.floor(Math.random()*2*Math.PI);
            this.body.setVelocityX(Math.cos(angle)*magnitude);
            this.body.setVelocityY(Math.sin(angle)*magnitude);
        }
        // animations & tweens
        this.anim = [
        ];
    }
}

class Explosion extends Phaser.GameObjects.Sprite {
    private grow: Phaser.Tweens.Tween;
    private fade: Phaser.Tweens.Tween;
    private autoPosition: boolean;
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        // image
        this.setScale(0.5);
        // animations & tweens
        this.grow = params.scene.add.tween({
            targets: this,
            duration: 400,
            onComplete: () => {
                this.fade = params.scene.add.tween({
                    targets: this,
                    duration: 300,
                    alpha: 0,
                    onComplete: () => {
                        this.destroy(params.scene);
                    }
                })
            },
            scaleX: 1.5,
            scaleY: 1.5,
        })
        this.autoPosition = !params.dontFixToCar;
    }
    update(car) {
        if (this.autoPosition) {
            this.setX(car.x);
        }
    }
}
