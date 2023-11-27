import { Position, Size, isDefined } from "../../../../utils";
import { Color } from "../../../Color";
import { CellId } from "../../CellId";
import { Tower, TowerOptions } from "../towers/specified-towers/Tower";
import { TowerTemplate } from "../towers/TowerTemplate";
import { GameCellOptions, defaultGameCellOptions } from "./GameCellOptions";

export class GameCell extends Phaser.GameObjects.Rectangle {
  private readonly options: GameCellOptions;
  private readonly specifiedColor: Color;
  private previewTower?: Tower;
  private previewTowerData?: TowerTemplate;
  private tower?: Tower;

  private isSelected = false;

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

  select() {
    this.cleanBuiltTowerCallbacks();
    this.isSelected = true;
    this.setSelectedColor();
  }

  unselect() {
    this.attachBuiltTowerCallbacks();
    this.isSelected = false;
    this.resetColor();
  }

  placeTower(data: TowerTemplate) {
    this.makeUnpickable();
    this.cleanPickableCallbacks();
    const { onTowerPlaced } = this.options;
    const createdTower = this.createTower(data);
    this.tower = createdTower;
    this.attachBuiltTowerCallbacks();
    if (onTowerPlaced) {
      onTowerPlaced(createdTower);
    }
  }

  makePickable(data: TowerTemplate) {
    if (this.tower) {
      console.warn(
        "! You are trying to make pickable cell with placed tower !",
        this
      );
      return;
    }
    if (!this.previewTowerData) {
      this.previewTowerData = data;
      this.setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      });
      this.setStrokeStyle(2, Color.Warn);
    } else {
      this.previewTowerData = data;
      this.cleanPickableCallbacks();
    }

    this.attachPickableCallbacks(data);
  }

  makeUnpickable() {
    if (this.tower) {
      console.warn(
        "! You are trying to make unpickable cell with placed tower !",
        this
      );
      return;
    }
    if (this.previewTowerData) {
      this.previewTowerData = undefined;

      this.setStrokeStyle(2, this.specifiedColor);
      this.setFillStyle(this.specifiedColor);
      this.cleanPickableCallbacks();

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

  private attachBuiltTowerCallbacks() {
    this.setInteractive({
      cursor: "url(assets/cursor_hand.png), default",
    });
    const { onBuiltTowerClicked } = this.options;
    if (onBuiltTowerClicked) {
      this.on(
        Phaser.Input.Events.POINTER_UP,
        (pointer: Phaser.Input.Pointer) => {
          if (pointer.leftButtonReleased()) {
            if (this.tower) {
              onBuiltTowerClicked(this.tower, this);
            } else {
              console.warn(
                "! There is built tower onClick callback attached but there is no tower place at the cell !",
                this
              );
            }
          }
        }
      );
    }
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.setSelectedColor();
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.resetColor();
    });
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanBuiltTowerCallbacks();
    });
  }

  private cleanBuiltTowerCallbacks() {
    this.disableInteractive();
    const { onBuiltTowerClicked } = this.options;
    if (onBuiltTowerClicked) {
      this.off(Phaser.Input.Events.POINTER_UP);
    }
  }

  private attachPickableCallbacks(data: TowerTemplate) {
    this.setInteractive({
      cursor: "url(assets/cursor_hand.png), default",
    });
    const { onPicked } = this.options;
    if (onPicked) {
      this.on(
        Phaser.Input.Events.POINTER_UP,
        (pointer: Phaser.Input.Pointer) => {
          if (pointer.leftButtonReleased()) {
            onPicked(this);
          }
        }
      );
    }
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.setFillStyle(Color.Success, 0.4);
      this.previewTower = this.createTower(data, {
        displayRange: true,
      }).setAlpha(0.3);
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.resetColor();
      if (this.previewTower) {
        this.previewTower.destroy(true);
        this.previewTower = undefined;
      }
    });
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanPickableCallbacks();
    });
  }

  private cleanPickableCallbacks() {
    this.disableInteractive();
    const { onPicked } = this.options;
    this.resetColor();
    this.off(Phaser.Input.Events.POINTER_OVER);
    this.off(Phaser.Input.Events.POINTER_OUT);
    if (onPicked) {
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

  // Colors
  private resetColor() {
    this.setFillStyle(this.specifiedColor);
  }

  private setSelectedColor() {
    this.setFillStyle(Color.Warn, 0.5);
  }
}
