/**
 * DrivingLevel
 */

const ITEM_TYPE_BOMB = 'bomb';
const ITEM_TYPE_HAT = 'hat';
const OFFSCREEN_EVENT = 'offscreen-event';
const mphPxScale = 0.65;
const NUM_HATS = 12;

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
    private numBombHits: number;

    private hatCountText: Phaser.GameObjects.Text;
    private bombCountText: Phaser.GameObjects.Text;
    private throwingStuffTimer: Phaser.Time.TimerEvent;

    constructor() {
        super({
            key: 'DrivingLevel'
        });
    }

    init() {
        this.speed = 35;
        this.numHatHits = 0;
        this.numBombHits = 0;
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
                fontSize: 36
            }
        );
        this.bombCountText = this.add.text(
            10,
            40,
            `Hit: ${this.numBombHits} bombs`,
            {
                'fontFamily': 'Cavalcade-Shadow',
                fontSize: 36
            }
        );
        this.hatCountText.setDepth(10);
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
                function(child) {
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
        this.throwingStuffTimer.reset({ delay: Phaser.Math.Between(300,1000), callback: this.throwRandomItem, callbackScope: this, repeat: 1});
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

    private objectWithType(object1, object2, type): void {
        if (object1.getData('itemType') === type) {
            return object1;
        }
        return object2
    }

    private hitBomb(object1, object2): void {
       const bomb = this.objectWithType(object1, object2, ITEM_TYPE_BOMB);
       this.numBombHits++;
       this.bombCountText.setText(`Hit: ${this.numBombHits} bombs`);
       this.bombs.remove(bomb, true, true);
       // explosion
       const explosion = new Explosion({
        scene: this,
        x: this.copCar.x,
        y: this.copCar.y,
        key: 'hatsplosion',
        car: this.copCar,
        });
       this.explosions.add(explosion);
       this.add.existing(explosion);
       this.dropHats();
    }

    private dropHats(): void {
        //TODO
    }

    private hitHat(object1, object2) {
        const hat = this.objectWithType(object1, object2, ITEM_TYPE_HAT);
        this.hats.remove(hat, true, true);
        this.numHatHits++;
        this.hatCountText.setText(`Hit: ${this.numHatHits} hats`);
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
        this.setData({
            'itemType': ITEM_TYPE_BOMB,
            'id': uuidv4(),
        });
    }
}

class Hat extends Phaser.GameObjects.Sprite {
    private anim: Phaser.Tweens.Tween[];

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.scene = params.scene;
        this.angle = 180;
        // physics
        params.scene.physics.world.enable(this);

        // animations & tweens
        this.anim = [
        ];
        this.setData({
            'itemType': ITEM_TYPE_HAT,
            'id': uuidv4(),
        });
    }
}

class Explosion extends Phaser.GameObjects.Sprite {
    private grow: Phaser.Tweens.Tween;
    private fade: Phaser.Tweens.Tween;
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
    }
    update(car) {
        this.setX(car.x);
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
