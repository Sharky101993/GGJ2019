import CutScene, { Slide } from './CutScene.ts';


const slideData: Slide[] = [
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'querrell',
        character: `SIR QUERRELL, LAST RODENT OF THE ROUND TABLE`,
        dialogue: `[PICKS UP HATTLEY] I KNOW THIS NOBLE HAT. FEAR NOT, LORD HATTLEY, I SHALL RETURN YOU TO WHERE YOU BELONG.`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'drivingLevelBackground',
        spriteKey: 'genghis',
        character: `GENGHIS COON THE TRAITOR`,
        dialogue: `I’M AFRAID I CAN’T LET YOU DO THAT, SIR QUERRELL. THE POWER OF HATTLEY WILL BELONG TO ME!`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'querrell',
        character: `SIR QUERRELL, LAST RODENT OF THE ROUND TABLE`,
        dialogue: `GENGHIS COON?! I’LL NEVER FORGIVE YOU FOR BETRAYING THE RODENTS OF THE ROUND TABLE.`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'genghis',
        character: `GENGHIS COON THE TRAITOR`,
        dialogue: `I KILLED ALL THE REST, AND YOU’RE NEXT.`,
        bgMusicKey: undefined,
    },
    {
        bgImageKey: 'fightingLevelBackground',
        spriteKey: 'querrell',
        character: `SIR QUERRELL, LAST RODENT OF THE ROUND TABLE`,
        dialogue: `YOU DON’T BELONG IN THIS WORLD, MONSTER! I’LL AVENGE MY FRIENDS AND RETURN HATTLEY TO HIS RIGHTFUL PLACE!`,
        bgMusicKey: undefined,
    },
];
export class Act3 extends CutScene {
    constructor() {
        super({
            key: 'Act3',
            slides: slideData,
            nextSceneKey: 'FightScene',
        });
    }
}
