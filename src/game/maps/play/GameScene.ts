import { Position, Size, isDefined } from "../../../utils";
import { RawColor } from "../../Color";
import { Image, Images } from "../../Image";
import { SceneKey } from "../../SceneKey";
import { ExportedGrid } from "../builder/ExportedGrid";
import { GameMap } from "./game-map/GameMap";
import { GameSceneData } from "./GameSceneData";
import { HeartsBar } from "./HeartsBar";
import { BankAccount } from "./BankAccount";
import { PlayAndStop } from "./PlayAndStop";
import { WaveTile } from "./WaveTile";
import { WavesBar } from "./WavesBar";
import { PickTower } from "./towers/PickTower";
import { TowerTile } from "./towers/TowerTile";
import { GameCell } from "./game-cell/GameCell";
import { Tower } from "./towers/specified-towers/Tower";
import { machineGunTowerTemplate } from "./towers/specified-towers/MachineGunTower";
import { TowerImage, towerImages } from "../../TowerImage";
import { canonTowerTemplate } from "./towers/specified-towers/CanonTower";
import { missileLauncherTowerTemplate } from "./towers/specified-towers/MissileLauncher";
import { EnemyAtlas, EnemyAtlases } from "./enemies/EnemyAtlas";
import { applyEnemyMultiplier } from "./enemies/applyEnemyMultiplier";
import { basicZombieEnemyTemplate } from "./enemies/BasicZombie";
import {
  createMultipleImagesConfigurations,
  createMultipleSoundsConfigurations,
} from "../../shared";
import { Sound, sounds } from "../../Sound";
import { PickTargeting } from "./pick-targeting/PickTargeting";

export class GameScene extends Phaser.Scene {
  private waveChangedSound!: Phaser.Sound.BaseSound;

  private map!: GameMap;
  private heartsBar!: HeartsBar;
  private wavesBar!: WavesBar;
  private grid!: ExportedGrid;
  private wavesInfo!: Phaser.GameObjects.Text;
  private playAndStop!: PlayAndStop;
  private pickTower!: PickTower;
  private bankAccount!: BankAccount;
  private pickTargeting?: PickTargeting;

  private isPlacingTower = false;
  private balance = 320;
  private passiveIncome = 20;
  private passiveIncomeIntervalInMs = 2000;
  private passiveIncomeTimerEvent!: Phaser.Time.TimerEvent;

  private readonly enemiesPerWave = 10;
  private readonly enemySpawnIntervalInMs = 1000;

  private spawnEnemiesTimerEvent?: Phaser.Time.TimerEvent;

  private builtTowerCellSelected?: GameCell;

  private placingTower?: TowerTile = undefined;

  private isStopped = true;

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
      onBuiltTowerClicked: (...args) => this.onBuiltTowerClicked(...args),
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

    //Towers
    const towerImagesConfigurations = createMultipleImagesConfigurations(
      TowerImage,
      towerImages
    );
    this.load.image(towerImagesConfigurations);

    // Sounds
    const soundsConfigurations = createMultipleSoundsConfigurations(
      Sound,
      sounds
    );
    this.load.audio(soundsConfigurations);

    const enemiesAtlasConfigurations: Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig[] =
      Object.values(EnemyAtlas)
        .map(
          (
            enemyKey
          ): Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig | null => {
            console.info(`# Creating atlas for enemy "${enemyKey}"`);
            const atlasConfig = EnemyAtlases[enemyKey];
            if (!atlasConfig) {
              const error = new Error(
                `!!! Missing atlas config for enemy "${enemyKey}"`
              );
              console.error(error);
              return null;
            }
            return {
              key: enemyKey,
              textureURL: atlasConfig.image,
              atlasURL: atlasConfig.json,
            };
          }
        )
        .filter(isDefined);
    this.load.atlas(enemiesAtlasConfigurations);
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
      this.isStopped,
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
      { x: this.scale.width - 200, y: 330 },
      { width: 400 },
      [
        machineGunTowerTemplate,
        canonTowerTemplate,
        missileLauncherTowerTemplate,
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

    this.waveChangedSound = this.sound.add(Sound.Bell);

    this.passiveIncomeTimerEvent = this.createPassiveIncomeTimerEvent();

    this.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        if (pointer.rightButtonReleased()) {
          this.cancelAnyActions();
        }
      }
    );

    console.log("--- create game scene", data);
    this.add.existing(this.map);
  }

  update(time: number, delta: number) {
    if (!this.isStopped) {
      this.map.updateEnemies(time, delta);
      this.map.updateTowers(time, delta);
    }
  }

  private cancelAnyActions() {
    this.map.makeUnpickable();
    if (this.builtTowerCellSelected) {
      this.builtTowerCellSelected.unselect();
    }
    if (this.pickTargeting) {
      this.pickTargeting.destroy(true);
      this.pickTargeting = undefined;
    }
  }

  private createPassiveIncomeTimerEvent() {
    return this.time.addEvent({
      callback: () => this.addMoney(this.passiveIncome),
      delay: this.passiveIncomeIntervalInMs,
      loop: true,
      paused: true,
    });
  }

  private createSpawnEnemiesTimerEvent(wave: WaveTile) {
    const multiplier = 1 + wave.getDetails().index / 10;
    const data = applyEnemyMultiplier(basicZombieEnemyTemplate, multiplier);
    const count = this.enemiesPerWave;
    const delay = this.enemySpawnIntervalInMs;

    console.info(`# Spawn enemies for wave ${wave.getDetails().name}`, {
      count,
      delay,
      data,
      multiplier,
    });

    return this.time.addEvent({
      callback: () => this.map.spawnEnemy(data),
      delay,
      repeat: count,
      paused: false,
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
    this.removeMoney(tile.data.levels[0].cost);
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
    this.isStopped = false;
    this.startPassiveIncome();
    this.wavesBar.start();
    if (this.spawnEnemiesTimerEvent) {
      this.spawnEnemiesTimerEvent.paused = false;
    }
  }

  private onStop() {
    console.info("# GameScene - stop");
    this.isStopped = true;
    this.stopPassiveIncome();
    this.wavesBar.stop();
    if (this.spawnEnemiesTimerEvent) {
      this.spawnEnemiesTimerEvent.paused = true;
    }
    this.map.stopTowers();
  }

  private onWaveChanged(wave: WaveTile) {
    console.info("# Wave changed", wave);
    this.waveChangedSound.play();
    const text = this.createWaveInfoMessage(wave.getDetails().index);
    this.wavesInfo.setText(text);
    if (this.spawnEnemiesTimerEvent) {
      this.spawnEnemiesTimerEvent?.destroy();
      this.spawnEnemiesTimerEvent = undefined;
    }
    this.spawnEnemiesTimerEvent = this.createSpawnEnemiesTimerEvent(wave);
  }

  private onBuiltTowerClicked(tower: Tower, cell: GameCell) {
    console.info("# Built tower clicked.", tower);
    cell.select();
    if (this.builtTowerCellSelected) {
      this.builtTowerCellSelected.unselect();
    }
    this.builtTowerCellSelected = cell;
    if (this.pickTargeting) {
      this.pickTargeting.destroy(true);
      this.pickTargeting = undefined;
    }
    this.pickTargeting = this.createTowerTargeting(tower);
  }

  private createTowerTargeting(tower: Tower) {
    return new PickTargeting(
      this,
      { x: this.scale.width - 150, y: 700 },
      {
        onChanged: (newTargeting) => {
          console.warn("### Targeting changed", newTargeting);
          tower.updateTargeting(newTargeting);
        },
        initial: tower.getTargeting(),
      }
    );
  }

  private onTowerPicked(tile: TowerTile) {
    this.placingTower = tile;
    this.map.makePickable(tile.data);
  }
}
