import { Position, Size } from "../../../utils";
import { RawColor } from "../../Color";
import { Image, Images } from "../../Images";
import { SceneKey } from "../../SceneKey";
import { ExportedGrid } from "../builder/ExportedGrid";
import { GameMap } from "./GameMap";
import { GameSceneData } from "./GameSceneData";
import { HeartsBar } from "./HeartsBar";
import { BankAccount } from "./BankAccount";
import { PlayAndStop } from "./PlayAndStop";
import { WaveTile } from "./WaveTile";
import { WavesBar } from "./WavesBar";
import { PickTower } from "./towers/PickTower";
import { TowerTemplate } from "./towers/TowerTemplate";
import { TowerTile } from "./towers/TowerTile";
import { CellId } from "../CellId";
import { GameCell } from "./GameCell";
import { Tower } from "./towers/Tower";

export class GameScene extends Phaser.Scene {
  private map!: GameMap;
  private heartsBar!: HeartsBar;
  private wavesBar!: WavesBar;
  private grid!: ExportedGrid;
  private wavesInfo!: Phaser.GameObjects.Text;
  private playAndStop!: PlayAndStop;
  private pickTower!: PickTower;
  private bankAccount!: BankAccount;

  private isPlacingTower = false;
  private balance = 120;
  private passiveIncome = 20;
  private passiveIncomeIntervalInMs = 2000;
  private passiveIncomeTimerEvent!: Phaser.Time.TimerEvent;

  private readonly towers: Tower[] = [];

  private placingTower?: TowerTile = undefined;

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
    this.map = new GameMap(this, position, size, grid, {
      onPicked: (...args) => this.cellPicked(...args),
    });
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
          cost: 100,
        },
        {
          name: "Bunker2",
          images: {
            base: Image.BunkerTowerBase,
            barrel: Image.BunkerTowerBarrel,
          },
          cost: 120,
        },
        {
          name: "Bunker3",
          images: {
            base: Image.BunkerTowerBase,
            barrel: Image.BunkerTowerBarrel,
          },
          cost: 140,
        },
        {
          name: "Bunker4",
          images: {
            base: Image.BunkerTowerBase,
            barrel: Image.BunkerTowerBarrel,
          },
          cost: 160,
        },
      ],
      {
        money: this.balance,
        onTowerPicked: (...args) => this.onTowerPicked(...args),
      }
    );
    this.bankAccount = new BankAccount(
      this,
      { x: 20, y: 20 },
      20,
      10,
      this.balance
    );

    this.passiveIncomeTimerEvent = this.createPassiveIncomeTimerEvent();

    console.log("--- create game scene", data);
    this.add.existing(this.map);
  }

  update() {
    // console.log(`### GameScene Update (${Date.now()})`)
  }

  private createPassiveIncomeTimerEvent() {
    return this.time.addEvent({
      callback: () => this.addMoney(this.passiveIncome),
      delay: this.passiveIncomeIntervalInMs,
      loop: true,
      paused: true,
    });
  }
  private cellPicked(cell: GameCell) {
    console.info("# Cell to place tower picked!");
    console.info("---> Picked cell:", cell);
    if (this.placingTower) {
      console.info("---> Placing tower:", this.placingTower);
      const couldBeBought = this.placingTower.couldBeBought(this.balance);
      console.info("---> Could be bought?:", couldBeBought);
      if (couldBeBought) {
        this.placeTower(cell, this.placingTower);
      }
    }
    this.map.makeUnpickable();
  }

  private placeTower(cell: GameCell, tile: TowerTile) {
    this.removeMoney(tile.data.cost);
    cell.placeTower(tile.data);
    this.placingTower = undefined;
  }

  private startPassiveIncome() {
    this.passiveIncomeTimerEvent.paused = false;
  }

  private stopPassiveIncome() {
    this.passiveIncomeTimerEvent.paused = true;
  }

  private addMoney(amount: number) {
    const newBalance = this.balance + amount;
    this.balance = newBalance;
    this.bankAccount.setMoney(newBalance);
    this.pickTower.updateBalance(newBalance);
  }

  private removeMoney(amount: number) {
    const newBalance = this.balance - amount;
    this.balance = newBalance;
    this.bankAccount.setMoney(newBalance);
    this.pickTower.updateBalance(newBalance);
  }

  private createWaveInfoMessage(waveIndex: number) {
    return `Wave: ${waveIndex + 1}`;
  }

  private onPlay() {
    console.info("# GameScene - play");
    this.startPassiveIncome();
    this.wavesBar.start();
  }

  private onStop() {
    console.info("# GameScene - stop");
    this.stopPassiveIncome();
    this.wavesBar.stop();
  }

  private onWaveChanged(wave: WaveTile) {
    const text = this.createWaveInfoMessage(wave.getDetails().index);
    this.wavesInfo.setText(text);
  }

  private onTowerPicked(tile: TowerTile) {
    console.info("# Tower picked!", tile.data);
    this.placingTower = tile;
    this.map.makePickable(tile.data);
  }
}
