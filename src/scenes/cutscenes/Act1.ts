import CutScene, { Slide } from './CutScene.ts';


const slideData: Slide[] = [
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'chappy',
        dialogue: `This is some dialogue from Chappy. I'm going to try to make this a bit longer so the animation works`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'drivingLevelBackground',
        spriteKey: 'officerSlide',
        dialogue: `I'm the officer. I'm kind of a hardass. But I'm a good guy in this game.`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'chappy',
        dialogue: `Yeah, I don't give a care, Officer. When you press enter at the end of this, it'll go to the next level.`,
        bgMusicKey: undefined,
    },
];
export class Act1 extends CutScene {
    constructor() {
        super({
            key: 'Act1',
            slides: slideData,
            nextSceneKey: 'WindScene',
        });
    }
}
