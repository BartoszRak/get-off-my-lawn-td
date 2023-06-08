import { Position, Size, isDefined } from "../../../utils";
import { ExportedCell } from "../builder/ExportedCell";
import { ExportedGrid } from "../builder/ExportedGrid";
import { GameCell } from "./GameCell";
import { Color } from "../../Color";
import { CellId } from "../CellId";
import { sortBy } from "lodash";

export interface GameMapOptions<T> {
  isButton?: boolean;
  onClick?: (map: T) => void;
}

export class GameMap extends Phaser.GameObjects.Container {
  private readonly cells: GameCell[];
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly columns: number;
  private readonly rows: number;
  private wasStartMarked = false;
  private pathIds: CellId[];

  constructor(
    scene: Phaser.Scene,
    private readonly mapPosition: Position,
    private readonly mapSize: Size,
    exportedGrid: ExportedGrid,
    private readonly options: GameMapOptions<GameMap> = {}
  ) {
    super(scene);
    this.pathIds = exportedGrid.pathIds.map((rawId) =>
      CellId.fromExisting(rawId)
    );
    this.columns = exportedGrid.columns;
    this.rows = exportedGrid.rows;

    this.wrapper = this.createWrapper(options);

    this.cells = exportedGrid.cells.map((exportedCell, index) => {
      const cell = this.createCell(exportedCell, index);
      this.scene.add.existing(cell);
      return cell;
    });

    // const curve = new Phaser.Curves.Curve()
    // curve.
    // const path = new Phaser.Curves.Path()
    // const sortedCells = this.cells.sort((prevCell, nextCell) => {
    //   if prevCell.isStar
    // })
    // path.add()
    this.createPath();
  }

  private createPath() {
    const unsortedPathCells = this.cells
      .filter((specifiedCell) => specifiedCell.isPath)
      .map((specifiedCell) => {
        return {
          cell: specifiedCell,
          order: this.pathIds.findIndex(
            (cellId) => cellId.value === specifiedCell.id.value
          ),
        };
      });
    const sortedPathCells = sortBy(unsortedPathCells, ["order"]);
    const pathCells = sortedPathCells.map(({ cell }) => cell);
    const startCell = pathCells[0];
    const path = new Phaser.Curves.Path(startCell.x, startCell.y);
    pathCells.forEach((specifiedCell) =>
      path.lineTo(specifiedCell.x, specifiedCell.y)
    );
    const graphics = this.scene.add.graphics({
      lineStyle: {
        width: 2,
        color: Color.LightGrey,
      },
    });
    path.draw(graphics);
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
      new CellId(rowIndex, columnIndex),
      position,
      size,
      exportedCell.isPath,
      isStart,
      isEnd
    );
  }

  private createWrapper({ isButton, onClick }: GameMapOptions<GameMap>) {
    const wrapper = this.scene.add
      .rectangle(
        this.mapPosition.x,
        this.mapPosition.y,
        this.mapSize.width,
        this.mapSize.height
      )
      .setStrokeStyle(2, parseInt("000000", 16))
      .setOrigin(0.5);

    if (isButton) {
      wrapper.setInteractive();
      if (isDefined(onClick)) {
        wrapper.on(Phaser.Input.Events.POINTER_UP, () => {
          onClick(this);
        });
      }
      wrapper.on(Phaser.Input.Events.POINTER_OVER, () => {
        wrapper.setStrokeStyle(2, Color.Success);
      });
      wrapper.on(Phaser.Input.Events.POINTER_OUT, () => {
        wrapper.setStrokeStyle(2, Color.Contour);
      });
    }

    return wrapper;
  }
}
