import { Position, Size } from "../../../utils";
import { SceneKey } from "../../SceneKey";
import { GameMap } from "./GameMap";
import { GameSceneData } from "./GameSceneData";

export class GameScene extends Phaser.Scene {
  private map!: GameMap;

  constructor(...data: any) {
    console.log("--- construct game scene", data);
    super({
      key: SceneKey.Game,
    });
  }

  init({ grid }: GameSceneData) {
    const { width, height } = this.scale;
    const position: Position = {
      x: width / 2,
      y: height / 2,
    };
    const size: Size = { width, height };
    this.map = new GameMap(this, position, size, grid);
  }

  preload() {
    console.log("--- preload game scene");
  }

  create(data: GameSceneData) {
    console.log("--- create game scene", data);
    this.add.existing(this.map);
  }

  update() {}
}
