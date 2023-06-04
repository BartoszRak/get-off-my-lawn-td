import Phaser from "phaser";
import StartScene from "./scenes/StartScene";
import { GameParentId } from "./GameParentId";
import { MainMenuScene } from "./scenes/MainMenuScene";

const createGame = (parent: HTMLElement | string) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      // arcade: {
      //   gravity: { y: 200 },
      // },
    },
    scene: [StartScene, MainMenuScene],
    fps: {
      min: 8,
      target: 16,
      limit: 60,
    },
    scale: {
      parent,
      width: "100%",
      height: "100%",
      expandParent: false,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      resizeInterval: 1000,
    },
  };

  return new Phaser.Game(config);
};

export const game = createGame(GameParentId);
