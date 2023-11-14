import { Position, Size } from "../../../../utils";
import { Color } from "../../../Color";
import { TowerTemplate } from "./TowerTemplate";
import { TowerTile } from "./TowerTile";

export interface PickTowerOptions {
  towersInRow: number;
}

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
    options: PickTowerOptions = {
      towersInRow: 3,
    }
  ) {
    super(scene);
    this.options = {
      ...options,
      tileSize: size.width / options.towersInRow,
    };
    this.wrapper = this.createWrapper();
    this.tiles = this.createTowerTiles(towers);

    this.addMultiple([this.wrapper /* All tiels childrens should be here? */]);
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
      const tile = new TowerTile(
        this.scene,
        { x, y },
        { width: this.options.tileSize, height: this.options.tileSize },
        specifiedTower
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
}
