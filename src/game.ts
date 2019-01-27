/// <reference path='./headers/phaser.d.ts'/>

import 'phaser';
import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { FightScene } from './scenes/FightScene';
import { DrivingLevel } from './scenes/DrivingLevel';
import { WindScene } from './scenes/WindScene';
import { Act1 } from './scenes/cutscenes/Act1';
import { Act2 } from './scenes/cutscenes/Act2';
import { Act3 } from './scenes/cutscenes/Act3';
import { Act4 } from './scenes/cutscenes/Act4';
import { GameEnd } from './scenes/GameEnd';

// main game configuration
const config: GameConfig = {
  title: 'Where your Hat is',
  width: 800,
  height: 600,
  type: Phaser.WEBGL,
  parent: 'game',
  scene: [Boot, MainMenu, Act1, WindScene, Act2, FightScene, Act3, DrivingLevel, Act4, GameEnd],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    }
  },
  backgroundColor: '#228B22',
  render: { pixelArt: true, antialias: false, autoResize: false }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener('load', () => {
  var game = new Game(config);
});
