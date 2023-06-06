import { Position, Size } from "../../../utils";
import { ExportedCell } from "../builder/ExportedCell";
import { ExportedGrid } from "../builder/ExportedGrid";
import { GameCell } from "./GameCell";

export class GameMap extends Phaser.GameObjects.Container {
  private readonly cells: GameCell[];
  private readonly columns: number;
  private readonly rows: number;
  private wasStartMarked = false;

  constructor(
    scene: Phaser.Scene,
    private readonly mapPosition: Position,
    private readonly mapSize: Size,
    exportedGrid: ExportedGrid
  ) {
    super(scene);

    this.columns = exportedGrid.columns;
    this.rows = exportedGrid.rows;

    this.createWrapper();

    this.cells = exportedGrid.cells.map((exportedCell, index) =>
      this.createCell(exportedCell, index)
    );
  }

  private createCell(exportedCell: ExportedCell, index: number) {
    const columnIndex = index % this.columns;
    const rowIndex = Math.floor(index / this.rows);
    const size: Size = {
      width: this.mapSize.width / this.columns,
      height: this.mapSize.height / this.rows,
    };
    const position: Position = {
      x:
        this.mapPosition.x +
        columnIndex * size.width -
        this.mapSize.width / 2 +
        size.width / 2,
      y:
        this.mapPosition.y +
        rowIndex * size.height -
        this.mapSize.height / 2 +
        size.height / 2,
    };

    const isStart =
      exportedCell.isPath && exportedCell.isEntry && !this.wasStartMarked
        ? true
        : false;
    const isEnd =
      exportedCell.isPath && exportedCell.isEntry && this.wasStartMarked
        ? true
        : false;
    if (isStart) {
      this.wasStartMarked = true;
    }
    return new GameCell(
      this.scene,
      position,
      size,
      exportedCell.isPath,
      isStart,
      isEnd
    );
  }

  private createWrapper() {
    this.scene.add
      .rectangle(
        this.mapPosition.x,
        this.mapPosition.y,
        this.mapSize.width,
        this.mapSize.height
      )
      .setStrokeStyle(2, parseInt("000000", 16))
      .setOrigin(0.5);
  }
}
