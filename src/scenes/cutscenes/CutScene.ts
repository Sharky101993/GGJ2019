export type Slide = {
    bgImageKey: string;
    spriteKey: string,
    character: string,
    dialogue: string,
    bgMusicKey: string | undefined;
}

export default class CutScene extends Phaser.Scene {
    // objects
    private enterKey: Phaser.Input.Keyboard.Key;
    private bg: Phaser.GameObjects.TileSprite;
    private dialogue: Phaser.GameObjects.Sprite;
    private characterText: Phaser.GameObjects.Text;
    private dialogueText: Phaser.GameObjects.Text;
    private slides: Slide[];
    private currSlideIdx;
    private bgSoundByIdx: (Phaser.Sound.BaseSound | null)[]; 
    private nextSceneKey: string;
    private dialogueTextTimer: Phaser.Time.TimerEvent;
    private talkingSprite: Phaser.GameObjects.Sprite;
    private enterButton: Phaser.GameObjects.Sprite;

    constructor(params) {
        super({
            key: params.key
        });
        this.nextSceneKey = params.nextSceneKey;
        this.slides = params.slides;
    }

    init(data): void {
        this.data = data;
        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.bgSoundByIdx = [];
        this.slides.forEach((s) => {
            if (s.bgMusicKey) {
                this.bgSoundByIdx.push(this.sound.add(s.bgMusicKey));
            } else {
                this.bgSoundByIdx.push(null);
            }
        });
    }

    private addTextLetter() {
        const currText = this.dialogueText.text;
        const fullText = this.slides[this.currSlideIdx].dialogue;
        if (currText.length === fullText.length) {
            return;
        }
        const nextText = currText + fullText.charAt(currText.length);
        this.dialogueText.setText(nextText);
    }

    create(): void {
        this.currSlideIdx = 0;
        this.characterText = this.add.text(
            80,
            420,
            this.slides[0].character,
            {
                fontSize: 28,
                wordWrap: {width: 600, useAdvancedWrap: true },
            },
        );
        this.dialogueText = this.add.text(
            100,
            450 + (this.slides.some(slide => slide.character.length > 40) ? 30 : 0),
            ``,
            {
                fontSize: 24,
                wordWrap: {width: 600, useAdvancedWrap: true },
            },
        );
        this.characterText.setDepth(10);
        this.dialogueText.width = 600;
        this.dialogueText.height = 200;
        this.dialogueText.setDepth(10);
        this.dialogueTextTimer = this.time.addEvent({
            delay: 50,
            callback: this.addTextLetter,
            callbackScope: this,
            loop: true,
        });
        this.bgSoundByIdx[0].play();
        this.dialogue = new Phaser.GameObjects.Sprite(this, 400, 500, 'dialogue');
        this.dialogue.setDepth(9);
        this.add.existing(this.dialogue);
        this.talkingSprite = new Phaser.GameObjects.Sprite(this, 40, 460, this.slides[0].spriteKey);
        this.talkingSprite.setDepth(11);
        this.add.existing(this.talkingSprite);
        this.bg = this.add.tileSprite(400, 300, 800, 600, this.slides[0].bgImageKey);

        this.enterButton = new Phaser.GameObjects.Sprite(this, 670, 550, 'enter', 0);
        this.enterButton.setDepth(100);
        this.add.existing(this.enterButton);
        this.anims.create({
            key: 'enterAnim',
            frames: [ { key: 'enter', frame: 0 }, { key: 'enter', frame: 1 } ],
            frameRate: 2,
            repeat: -1
        });
    }

    nextSlide(): void {
        this.currSlideIdx++;
        this.bg.destroy();
        this.bg = this.add.tileSprite(400, 300, 800, 600, this.slides[this.currSlideIdx].bgImageKey);
        this.characterText.setText(this.slides[this.currSlideIdx].character);
        this.dialogueText.setText('');
        this.dialogueTextTimer = this.time.addEvent({
            delay: 50,
            callback: this.addTextLetter,
            callbackScope: this,
            loop: true,
        });
        this.bgSoundByIdx[this.currSlideIdx].play();
        this.talkingSprite.destroy();
        this.talkingSprite = new Phaser.GameObjects.Sprite(this, 40, 460, this.slides[this.currSlideIdx].spriteKey);
        this.talkingSprite.setDepth(11);
        this.add.existing(this.talkingSprite);
    }

    update(): void {
        this.enterButton.anims.play('enterAnim', true);
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            const fullTextCurrDialogue = this.slides[this.currSlideIdx].dialogue;
            const fullTextShowing = this.dialogueText.text.length === fullTextCurrDialogue.length;
            if (fullTextShowing) {
                this.bgSoundByIdx[this.currSlideIdx].destroy();
            }
            if (this.currSlideIdx === this.slides.length-1 && fullTextShowing) {
                this.scene.start(this.nextSceneKey, this.data);
                return;
            }
            if (fullTextShowing) {
                this.nextSlide();
            } else {
                this.dialogueTextTimer.destroy();
                this.dialogueText.setText(fullTextCurrDialogue);
            }
        }
    }
}
