import { Position, Size } from "../../../utils";
import { RawColor } from "../../Color";
import { Image, Images } from "../../Images";
import { SceneKey } from "../../SceneKey";
import { ExportedGrid } from "../builder/ExportedGrid";
import { GameMap } from "./GameMap";
import { GameSceneData } from "./GameSceneData";
import { HeartsBar } from "./HeartsBar";
import { PlayAndStop } from "./PlayAndStop";
import { WaveTile } from "./WaveTile";
import { WavesBar } from "./WavesBar";
import { PickTower } from "./towers/PickTower";

export class GameScene extends Phaser.Scene {
  private map!: GameMap;
  private heartsBar!: HeartsBar;
  private wavesBar!: WavesBar;
  private grid!: ExportedGrid;
  private wavesInfo!: Phaser.GameObjects.Text;
  private playAndStop!: PlayAndStop;

  private pickTower!: PickTower;

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
    // Misc
    this.load.image(...Images[Image.PaperHeart]);
    this.load.image(...Images[Image.PaperHeartFull]);
    this.load.image(...Images[Image.Play]);
    this.load.image(...Images[Image.PlayFull]);
    this.load.image(...Images[Image.Stop]);
    this.load.image(...Images[Image.StopFull]);
    this.load.image(...Images[Image.PointerFlat]);
    this.load.image(...Images[Image.CursorHand]);
    // Towers
    this.load.image(...Images[Image.BunkerTowerBase]);
    this.load.image(...Images[Image.BunkerTowerBarrel]);
  }

  create(data: GameSceneData) {
    const { width, height } = this.scale;
    const barWidth = 400;
    const barHeight = 40;
    this.playAndStop = new PlayAndStop(
      this,
      {
        x: width - 100,
        y: height - 100,
      },
      {
        width: 100,
        height: 100,
      },
      undefined,
      {
        onPlay: () => this.onPlay(),
        onStop: () => this.onStop(),
      }
    );
    this.heartsBar = new HeartsBar(
      this,
      {
        x: width - barWidth / 2 - 20,
        y: 30,
      },
      { width: barWidth },
      10
    );
    const startWaveIndex = 3;
    this.wavesBar = new WavesBar(
      this,
      {
        x: width - barWidth / 2 - 20,
        y: 120,
      },
      { width: barWidth, height: barHeight },
      startWaveIndex,
      100,
      undefined,
      { onWaveChanged: (...args) => this.onWaveChanged(...args) }
    );
    this.wavesInfo = this.add.text(
      width - barWidth / 4 - 20,
      120 + 1.5 * barHeight,
      this.createWaveInfoMessage(startWaveIndex),
      {
        fontSize: 25,
        color: RawColor.Contour,
      }
    );
    this.pickTower = new PickTower(
      this,
      { x: this.scale.width - 200, y: 430 },
      { width: 300, height: 400 },
      [
        {
          name: "Bunker",
          images: {
            base: Image.BunkerTowerBase,
            barrel: Image.BunkerTowerBarrel,
          },
        },
        {
          name: "Bunker2",
          images: {
            base: Image.BunkerTowerBase,
            barrel: Image.BunkerTowerBarrel,
          },
        },
        {
          name: "Bunker3",
          images: {
            base: Image.BunkerTowerBase,
            barrel: Image.BunkerTowerBarrel,
          },
        },
        {
          name: "Bunker4",
          images: {
            base: Image.BunkerTowerBase,
            barrel: Image.BunkerTowerBarrel,
          },
        },
      ]
    );
    console.log("--- create game scene", data);
    this.add.existing(this.map);
  }

  update() {
    // console.log(`### GameScene Update (${Date.now()})`)
  }

  private createWaveInfoMessage(waveIndex: number) {
    return `Wave: ${waveIndex + 1}`;
  }

  private onPlay() {
    console.info("# GameScene - play");
    this.wavesBar.start();
  }

  private onStop() {
    console.info("# GameScene - stop");
    this.wavesBar.stop();
  }

  private onWaveChanged(wave: WaveTile) {
    const text = this.createWaveInfoMessage(wave.getDetails().index);
    this.wavesInfo.setText(text);
  }
}
