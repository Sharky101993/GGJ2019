import CutScene, { Slide } from './CutScene.ts';


const slideData: Slide[] = [
    {
        bgImageKey: 'act4BG',
        spriteKey: undefined,
        character: ``,
        dialogue: `[SIR QUERRELL TAKES HATTLEY TO THE DOORSTEP OF THE BOY]`,
        bgMusicKey: 'narrator3',
    },
    {
        bgImageKey: 'act4BG',
        spriteKey: 'querrell',
        character: `SIR QUERRELL, LAST RODENT OF THE ROUND TABLE`,
        dialogue: `LORD HATTLEY, WE MADE IT.`,
        bgMusicKey: 'sq4',
    },
    {
        bgImageKey: 'act4BG',
        spriteKey: 'chappy',
        character: `HATTLEY`,
        dialogue: `HOME AT LAST! IT’S BEEN A LONG JOURNEY BUT I CAN FINALLY REST THESE WEARY THREADS.`,
        bgMusicKey: 'hattley3',
    },
];
export class Act4 extends CutScene {
    constructor() {
        super({
            key: 'Act4',
            slides: slideData,
            nextSceneKey: 'GameEnd',
        });
    }
}
