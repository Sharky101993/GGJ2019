import CutScene, { Slide } from './CutScene.ts';


const slideData: Slide[] = [
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'officer',
        character: `OFFICER BEANIE JONES`,
        dialogue: `THAT GUY STOLE MY HAT! AND IT LOOKS LIKE HE STOLE A BUNCH OF OTHER HATS TOO!`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'drivingLevelBackground',
        spriteKey: 'hatter',
        character: `MAD HATTER`,
        dialogue: `YOU IDIOT. HAD YOUR HAT ON A LITTLE TOO TIGHT NOW, DID YOU? NO MATTER. YOU’LL NEVER GET THESE HATS BACK IN ONE PIECE!`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'officer',
        character: `OFFICER BEANIE JONES`,
        dialogue: `I HAVE TO GET ALL THESE HATS BACK TO THEIR OWNERS, AND STOP THE MAD HATTER.`,
        bgMusicKey: undefined,
    },
];
export class Act2 extends CutScene {
    constructor() {
        super({
            key: 'Act2',
            slides: slideData,
            nextSceneKey: 'DrivingLevel',
        });
    }
}
