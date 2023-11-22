import { Position, Size, isDefined } from "../../../utils";
import { Color } from "../../Color";
import { CellId } from "../CellId";
import { Tower, TowerOptions } from "./towers/specified-towers/Tower";
import { TowerTemplate } from "./towers/TowerTemplate";

export interface GameCellOptions {
  isPath?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  onPicked?: (cell: GameCell) => void;
  onTowerPlaced?: (tower: Tower) => void;
  towerSizePercentage: number;
}

const defaultGameCellOptions: GameCellOptions = {
  towerSizePercentage: 1,
};

export class GameCell extends Phaser.GameObjects.Rectangle {
  private readonly options: GameCellOptions;
  private readonly specifiedColor: Color;
  private previewTower?: Tower;
  private previewTowerData?: TowerTemplate;
  private tower?: Tower;

  constructor(
    scene: Phaser.Scene,
    public readonly id: CellId,
    cellPosition: Position,
    cellSize: Size,
    options: Partial<GameCellOptions>
  ) {
    const mergedOptions: GameCellOptions = {
      ...defaultGameCellOptions,
      ...options,
    };
    const { isStart, isEnd, isPath } = mergedOptions;
    const getColor = () => {
      if (isPath) {
        if (isStart) {
          return Color.Success;
        }
        if (isEnd) {
          return Color.Error;
        }
        return Color.Background;
      }

      return Color.Grey;
    };
    const color = getColor();

    super(
      scene,
      cellPosition.x,
      cellPosition.y,
      cellSize.width,
      cellSize.height,
      color,
      isStart || isEnd ? 0.2 : 1
    );
    this.specifiedColor = color;
    this.options = mergedOptions;
  }

  placeTower(data: TowerTemplate) {
    const { onTowerPlaced } = this.options;
    const createdTower = this.createTower(data);
    this.tower = createdTower;
    if (onTowerPlaced) {
      onTowerPlaced(createdTower);
    }
  }

  makePickable(data: TowerTemplate) {
    if (!this.previewTowerData) {
      this.previewTowerData = data;
      this.setInteractive();
      this.setStrokeStyle(2, Color.Warn);
    } else {
      this.previewTowerData = data;
      this.cleanCallbacks();
    }

    this.attachCallbacks(data);
  }

  makeUnpickable() {
    if (this.previewTowerData) {
      this.previewTowerData = undefined;

      this.disableInteractive();
      this.setStrokeStyle(2, this.specifiedColor);
      this.setFillStyle(this.specifiedColor);
      this.cleanCallbacks();

      if (this.previewTower) {
        this.previewTower.destroy(true);
        this.previewTower = undefined;
      }
    }
  }

  private createTower(data: TowerTemplate, options?: Partial<TowerOptions>) {
    const width = this.options.towerSizePercentage * this.width;
    const height = this.options.towerSizePercentage * this.height;
    const x = this.x;
    const y = this.y;
    return new Tower(
      this.scene,
      {
        x,
        y,
      },
      {
        width,
        height,
      },
      data,
      options
    );
  }

  private attachCallbacks(data: TowerTemplate) {
    const { onPicked: onClick } = this.options;
    if (onClick) {
      this.on(Phaser.Input.Events.POINTER_UP, () => {
        onClick(this);
      });
    }
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.setFillStyle(Color.Success, 0.4);
      this.previewTower = this.createTower(data, {
        displayRange: true,
      }).setAlpha(0.3);
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.setFillStyle(this.specifiedColor);
      if (this.previewTower) {
        this.previewTower.destroy(true);
        this.previewTower = undefined;
      }
    });
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanCallbacks();
    });
  }

  private cleanCallbacks() {
    const { onPicked: onClick } = this.options;
    this.off(Phaser.Input.Events.POINTER_OVER);
    this.off(Phaser.Input.Events.POINTER_OUT);
    if (onClick) {
      this.off(Phaser.Input.Events.POINTER_UP);
    }
  }

  couldBePickable() {
    return [
      this.options.isEnd,
      this.options.isStart,
      this.options.isPath,
      this.hasTower(),
    ].every((value) => value !== true);
  }

  hasTower() {
    return isDefined(this.tower);
  }

  isPath() {
    return this.options.isPath;
  }

  isEnd() {
    return this.options.isEnd;
  }

  isStart() {
    return this.options.isStart;
  }
}
