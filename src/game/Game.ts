import Phaser from "phaser";
import HelloWorldScene from "./scenes/HelloWorld";
import { GameParentId } from "./GameParentId";

const createGame = (parent: HTMLElement | string) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200 },
      },
    },
    scene: HelloWorldScene,
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
