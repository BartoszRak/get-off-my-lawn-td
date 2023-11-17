import { Position, Size } from "../../../../utils";
import { Color } from "../../../Color";
import { TowerTemplate } from "./TowerTemplate";
import { TowerTile } from "./TowerTile";

export interface PickTowerOptions {
  towersInRow: number;
  onTowerPicked?: (data: TowerTemplate, tile: TowerTile) => void;
  money: number;
}

const defaultOptions: PickTowerOptions = {
  towersInRow: 3,
  money: 0,
};

export type PickTowerFullOptions = PickTowerOptions & {
  tileSize: number;
};

export class PickTower extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly tiles: TowerTile[];
  private readonly options: PickTowerFullOptions;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    towers: TowerTemplate[],
    options: Partial<PickTowerOptions> = defaultOptions
  ) {
    super(scene);
    const fullOptions: PickTowerOptions = {
      ...options,
      ...defaultOptions,
    };
    this.options = {
      ...fullOptions,
      tileSize: size.width / fullOptions.towersInRow,
    };
    this.wrapper = this.createWrapper();
    this.tiles = this.createTowerTiles(towers);

    this.addMultiple([this.wrapper /* All tiels childrens should be here? */]);
  }

  updateBalance(balance: number) {
    this.options.money = balance;
    this.tiles.forEach((specifiedTile) => {
      if (specifiedTile.couldBeBought(balance)) {
        specifiedTile.enable();
      } else {
        specifiedTile.disable();
      }
    });
  }

  private createTowerTiles(towers: TowerTemplate[]) {
    return towers.map((specifiedTower, index) => {
      const cell = index % this.options.towersInRow;
      const row = Math.floor(index / this.options.towersInRow);
      console.log(`### Tile: ${index} / row: ${row} / cell: ${cell}`);
      const y =
        this.position.y + row * this.options.tileSize - this.size.height / 2;
      const x =
        this.position.x - this.size.width / 2 + this.options.tileSize * cell;
      const couldBeBought = specifiedTower.cost <= this.options.money;
      const disabled = couldBeBought ? false : true;
      const tile = new TowerTile(
        this.scene,
        { x, y },
        { width: this.options.tileSize, height: this.options.tileSize },
        specifiedTower,
        {
          strokeWidth: 5,
          onClick: (...args) => this.onTowerClicked(...args),
          disabled,
        }
      );
      this.scene.add.existing(tile);
      return tile;
    });
  }

  private createWrapper() {
    const { x, y } = this.position;
    const { width, height } = this.size;
    const wrapper = new Phaser.GameObjects.Rectangle(
      this.scene,
      x,
      y,
      width,
      height
    ).setStrokeStyle(2, Color.Contour);
    this.scene.add.existing(wrapper);

    return wrapper;
  }

  private onTowerClicked(data: TowerTemplate, tile: TowerTile) {
    console.info("# Tower picked!", data);
    const { onTowerPicked } = this.options;
    if (onTowerPicked) {
      onTowerPicked(data, tile);
    }
  }
}
