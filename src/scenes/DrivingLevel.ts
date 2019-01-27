
const ITEM_TYPE_BOMB = 'bomb';
const ITEM_TYPE_HAT = 'hat';
const mphPxScale = 0.65;
const NUM_HATS = 12;

const HATS_TO_WIN = 5;

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
    private explodeSound: Phaser.Sound.BaseSound;
    private sirenSound: Phaser.Sound.BaseSound;
    private engineSound: Phaser.Sound.BaseSound;
    private coinSound: Phaser.Sound.BaseSound;
    private throwHatSound: Phaser.Sound.BaseSound;
    private throwBombSound: Phaser.Sound.BaseSound;
    private music: Phaser.Sound.BaseSound;

    // variables
    private speed: number;
    private numHatHits: number;
    private hatPower: number;

    private hatCountText: Phaser.GameObjects.Text;
    private hatPowerText: Phaser.GameObjects.Text;
    private throwingStuffTimer: Phaser.Time.TimerEvent;

    private playerWon: boolean;

    constructor() {
        super({
            key: 'DrivingLevel'
        });
    }

    init(data) {
        this.speed = 35;
        this.numHatHits = 0;
        this.bg = null;
        this.bombs = this.add.group({ classType: Bomb });
        this.hats = this.add.group({ classType: Hat });
        this.explosions = this.add.group({ classType: Explosion });
        this.hatPower = data.hp;
        this.explodeSound = this.sound.add('level2Explosion');
        this.sirenSound = this.sound.add('level2Siren', {
            'loop': true,
            'volume': 0.03,
        });
        this.engineSound = this.sound.add('level2Engine', {
            'loop': true,
        });
        this.coinSound = this.sound.add('level2CollectHat');
        this.throwHatSound = this.sound.add('level2ThrowHat');
        this.throwBombSound = this.sound.add('level2ThrowBomb');
        this.music = this.sound.add('level2Music');
        this.playerWon = false;
    }

    create() {
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'drivingLevelBackground');
        this.music.play();
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
        this.hatterCar.music = this.music;
        this.add.existing(this.hatterCar);
        this.throwingStuffTimer = this.time.addEvent({
            delay: 750,
            callback: this.throwRandomItem,
            callbackScope: this,
            loop: false
        });
        this.sirenSound.play();
        //this.engineSound.play();
    }

    update() {
       this.bg.tilePositionY -= ((this.speed-10)*mphPxScale);
       this.hatterCar.update();
       if (!this.playerWon) {
            this.copCar.update();
            this.physics.overlap(this.copCar, this.bombs, this.hitBomb, null, this);
            this.physics.overlap(this.copCar, this.hats, this.hitHat, null, this);
       }
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
        if (Math.random() > 0.8) {
            this.throwHat();
        } else {
            this.throwBomb();
        }
        this.throwingStuffTimer.reset({ delay: Phaser.Math.Between(200,750), callback: this.throwRandomItem, callbackScope: this, repeat: 1});
    }

    private throwHat(): void {
        this.throwHatSound.play();
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
        this.throwBombSound.play();
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
        return object2;
    }

    private hitBomb(object1, object2): void {
        this.explodeSound.play();
       const bomb = this.objectWithType(object1, object2, ITEM_TYPE_BOMB);
       this.hatPower--;
       this.hatterCar.hp--;
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
            // this.scene.start('MainMenu', this.scene);
            this.endGameWithScene('MainMenu', null);
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
        this.explodeSound.play();
        this.sirenSound.stop();
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
               callback: () => {
                this.sirenSound.stop();
                //this.engineSound.stop();
                callback();
               },
           });
    }

    private hitHat(object1, object2) {
        this.coinSound.play();
        this.numHatHits++;
        this.updateHatCountText();
        if (this.numHatHits === HATS_TO_WIN) {
            const hat = this.objectWithType(object1, object2, ITEM_TYPE_HAT);
            this.hats.remove(hat, true, true);
            this.playerWon = true;
            this.throwingStuffTimer.destroy();
            this.hatterCar.spiralOutOfControl();
            this.copCar.stopMoving();
            this.add.tween({
                targets: this.sirenSound,
                volume: 0,
                duration: 2000,
                onComplete: () => {
                    this.sirenSound.destroy();
                },
            })
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
        if (this.isDead) {
            return;
        }
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
    stopMoving(): void {
        this.body.setVelocityX(0);
        this.setAngle(0);
        this.isDead = true;
    }
}

class HatterCar extends Phaser.GameObjects.Sprite {
    private anim: Phaser.Tweens.Tween[];
    private changeDirectionTimer: Phaser.Time.TimerEvent;
    // if false moving right
    private movingLeft: boolean;

    private isSpiralingOutOfControl: boolean;
    private finalHatShot: boolean;
    private finalHat: Phaser.GameObjects.Sprite;
    private spinFinalHat: boolean;

    private deathExplosionEmit: Phaser.Time.TimerEvent;
    private explodeSound: Phaser.Sound.BaseSound;
    private tireSkidSound: Phaser.Sound.BaseSound;

    public hp: number;
    public music: Phaser.Sound.BaseSound;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(0.45);
        // physics
        params.scene.physics.world.enable(this);
        this.body.setSize(100, 300);
        this.body.allowGravity = false; 
        this.movingLeft = true;
        this.changeDirectionTimer = params.scene.time.addEvent({
            delay: 750,
            callback: this.handleDirectionChange,
            callbackScope: this,
            loop: false,
        });
        this.isSpiralingOutOfControl = false;
        this.finalHatShot = false;
        this.spinFinalHat = false;
        this.finalHat = null;
        this.explodeSound = this.scene.sound.add('level2Explosion', {
            'loop': true,
        });
        this.tireSkidSound = this.scene.sound.add('level2TireSkid');
        this.hp = params.scene.hatPower;
    }

    private handleDirectionChange(): void {
        this.changeDirectionTimer.reset({ delay: Phaser.Math.Between(200,1500), callback: this.handleDirectionChange, callbackScope: this, repeat: 1});
        this.movingLeft = !this.movingLeft;
    }

    update(): void {
        if (this.isSpiralingOutOfControl) {
            this.setAngle(this.angle + 10);
            if (this.x >= 750 || this.x <= 50) {
                this.deathExplosionEmit.destroy();
                this.shootFinalHat();
            }
            if (this.spinFinalHat && this.finalHat) {
                this.finalHat.setAngle(this.finalHat.angle + 10);
            }
            return;
        }
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


    spiralOutOfControl():void {
        this.changeDirectionTimer.destroy();
        //this.explodeSound.play();
        this.tireSkidSound.play();
        this.isSpiralingOutOfControl = true;
        this.body.setVelocityY(100);
        if (this.x >= 300) {
            this.body.setVelocityX(100);
        } else {
            this.body.setVelocityX(-100);
        }
        this.deathExplosionEmit = this.scene.time.addEvent({
            delay: 125,
            callback: () => {
                const magnitude = 160;
                const angle = Math.floor(Math.random()*2*Math.PI);
                const explosion = new Explosion({
                    scene: this.scene,
                    x: this.x,
                    y: this.y,
                    velocityX: Math.cos(angle)*magnitude,
                    velocityY: Math.sin(angle)*magnitude,
                    key: 'hatsplosion',
                    dontFixToCar: true,
                  });
                //this.scene.add.existing(explosion);
            },
            callbackScope: this,
            loop: false,
        });
    }

    private shootFinalHat(): void {
        if (this.finalHatShot) { return };
        this.finalHatShot = true;
        this.finalHat = new Phaser.GameObjects.Sprite(
            this.scene,
            this.x,
            this.y,
            'chappy',
          );
        this.scene.physics.world.enable(this.finalHat);
        this.finalHat.body.allowGravity = false;
        this.scene.add.existing(this.finalHat);
        this.scene.add.tween({
            targets: this.finalHat,
            duration: 2000,
            scaleX: 3,
            scaleY: 3,
            x: 400,
            y: 300,
            onComplete: () => {
                this.scene.add.tween({
                    targets: this.finalHat,
                    duration: 2000,
                    scaleX: 60,
                    scaleY: 60,
                    onComplete: () => {
                        this.spinFinalHat = false;
                        this.endGameWithScene('Act3', {hp: this.hp});
                        // this.scene.scene.start('Act3', {hp: this.hp});
                    }
                });
                this.spinFinalHat = true;
            },
        });
        this.scene.add.tween({
            targets: this.explodeSound,
            volume: 0,
            duration: 3000,
            onComplete: () => {
                this.explodeSound.destroy();
            },
        })
    }

    private endGameWithScene(scene, data): void {
        this.scene.add.tween({
            targets: this.music,
            volume: 0,
            duration: 300,
            onComplete: () => {
                this.music.destroy();
                this.scene.scene.start(scene, data);
            },
        })
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
        this.body.allowGravity = false;
        this.body.setVelocityY(400);
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
        if (params.velocityX && params.velocityY) {
            params.scene.physics.world.enable(this);
            this.body.setVelocityX(params.velocityX);
            this.body.setVelocityY(params.velocityY);
        }
    }
    update(car) {
        if (this.autoPosition) {
            this.setX(car.x);
        }
    }
}
