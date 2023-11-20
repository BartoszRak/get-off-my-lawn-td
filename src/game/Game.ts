import Phaser from "phaser";
import StartScene from "./start/StartScene";
import { GameParentId } from "./GameParentId";
import { MainMenuScene } from "./menu/MainMenuScene";
import { PickMapScene } from "./maps/play/PickMapScene";
import { BuilderScene } from "./maps/builder/BuilderScene";
import { GameScene } from "./maps/play/GameScene";

const createGame = (parent: HTMLElement | string) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: "ffffff",
    disableContextMenu: true,
    render: {
      antialiasGL: true,
      antialias: true,
    },
    physics: {
      default: "arcade",
      arcade: {
        // debug: true
      }
      // arcade: {
      //   gravity: { y: 200 },
      // },
    },
    scene: [StartScene, MainMenuScene, PickMapScene, BuilderScene, GameScene],
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

