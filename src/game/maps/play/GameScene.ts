import { Position, Size } from "../../../utils";
import { Image, Images } from "../../Images";
import { SceneKey } from "../../SceneKey";
import { ExportedGrid } from "../builder/ExportedGrid";
import { GameMap } from "./GameMap";
import { GameSceneData } from "./GameSceneData";
import { HeartsBar } from "./HeartsBar";
import { WavesBar } from "./WaveBar";

export class GameScene extends Phaser.Scene {
  private map!: GameMap;
  private heartsBar!: HeartsBar;
  private wavesBar!: WavesBar;
  private grid!: ExportedGrid;

  constructor(...data: any) {
    console.log("--- construct game scene", data);
    super({
      key: SceneKey.Game,
    });
    // const { width } = this.scale;
    //  new HeartsBar(
    //     this,
    //     {
    //       x: 100,
    //       y: 120,
    //     },
    //     { width: 30 },
    //     10
    //   );
  }

  init({ grid }: GameSceneData) {
    this.grid = grid;
    const { width, height } = this.scale;
    const position: Position = {
      x: width / 2,
      y: height / 2,
    };
    const size: Size = { width: height, height };
    this.map = new GameMap(this, position, size, grid);
  }

  preload() {
    console.log("--- preload game scene");
    console.log("--- load paper", ...Images[Image.PaperHeart]);
    this.load.image(...Images[Image.PaperHeart]);
    this.load.image(...Images[Image.PaperHeartFull]);
  }

  create(data: GameSceneData) {
    const { width } = this.scale;
    const barWidth = 400;
    this.heartsBar = new HeartsBar(
      this,
      {
        x: width - barWidth / 2 - 20,
        y: 30,
      },
      { width: barWidth },
      10
    );
    this.wavesBar = new WavesBar(
      this,
      {
        x: width - barWidth / 2 - 20,
        y: 120,
      },
      { width: barWidth, height: 40 },
      3
    );

    console.log("--- create game scene", data);
    this.add.existing(this.map);
  }

  update() {}
}
