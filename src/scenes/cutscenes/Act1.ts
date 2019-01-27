import CutScene, { Slide } from './CutScene.ts';


const slideData: Slide[] = [
    {
        bgImageKey: 'act1BG',
        spriteKey: 'father',
        character: `FATHER`,
        dialogue: `BOY. COME HOME NOW.`,
        bgMusicKey: 'father1',
    },
    {
        bgImageKey: 'act1BG',
        spriteKey: 'boy',
        character: `BOY`,
        dialogue: `OKAY.\n[BOY LEAVES]`,
        bgMusicKey: 'boy1',
    },
    {
        bgImageKey: 'act1BG',
        spriteKey: 'father',
        character: `FATHER`,
        dialogue: `WHERE IS YOUR HAT?`,
        bgMusicKey: 'father2',
    },
    {
        bgImageKey: 'act1BG',
        spriteKey: 'boy',
        character: `BOY`,
        dialogue: `I’M NOT SURE.`,
        bgMusicKey: 'boy2',
    },
    {
        bgImageKey: 'act1BG',
        spriteKey: 'father',
        character: `FATHER`,
        dialogue: `BOY. THAT HAT WAS PASSED DOWN IN OUR BLOODLINE FOR GENERATIONS. IT GIVES THE WEARER LUCK BEYOND COMPARE. YOU’D BETTER HOPE IT FINDS ITS WAY BACK TO YOU.`,
        bgMusicKey: 'father3',
    },
    {
        bgImageKey: 'act1BG',
        spriteKey: 'chappy',
        character: `HATTLEY`,
        dialogue: `OH NO, I’VE BEEN LEFT BEHIND! THEY NEED ME. WHO WILL PROTECT BOY FROM THE SUNLIGHT? I NEED TO GET BACK HOME POST-HASTE!`,
        bgMusicKey: 'hattley1',
    },
    {
        bgImageKey: 'act1BG',
        spriteKey: 'chappy',
        character: `HATTLEY`,
        dialogue: `THAT TRUCK OVER THERE COULD PROBABLY GET ME THERE. BUT I CAN’T WALK! IT’LL TAKE A MIRACLE TO GET ME THERE.`,
        bgMusicKey: 'hattley2',
    }
];
export class Act1 extends CutScene {
    constructor() {
        super({
            key: 'Act1',
            slides: slideData,
            nextSceneKey: 'Instructions1',
        });
    }
}
