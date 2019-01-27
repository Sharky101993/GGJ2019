/// <reference path='./headers/phaser.d.ts'/>

import 'phaser';
import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { FightScene } from './scenes/FightScene';
import { DrivingLevel } from './scenes/DrivingLevel';
import { WindScene } from './scenes/WindScene';
import { Act1 } from './scenes/Act1';

// main game configuration
const config: GameConfig = {
  title: 'Where your Hat is',
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [Boot, MainMenu, Act1, WindScene, FightScene, DrivingLevel],
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
      debug: true
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
