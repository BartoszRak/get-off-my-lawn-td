import { flatten } from "lodash";
import { Position, Size } from "../../utils";
import { BuilderCell } from "./BuilderCell";

interface RowsAndColumns {
  rows: number;
  columns: number;
}

export class BuilderGrid extends Phaser.GameObjects.Container {
  private readonly allCells: BuilderCell[] = [];
  private selectedCells: BuilderCell[] = [];
  private startingCell?: BuilderCell;
  private endingCell?: BuilderCell;
  private draggedOver: BuilderCell[] = [];
  private isDragging = false;

  constructor(
    scene: Phaser.Scene,
    private readonly gridPosition: Position,
    private readonly gridSize: Size,
    private readonly gridCount: RowsAndColumns
  ) {
    super(scene);

    const gridRectangle = this.scene.add
      .rectangle(
        gridPosition.x,
        gridPosition.y,
        gridSize.width,
        gridSize.height,
        parseInt("000000", 16),
        0.1
      )
      .setOrigin(0.5)
      .setStrokeStyle(1, parseInt("000000", 16));
    // gridRectangle.on(Phaser.Input.Events.POINTER_OUT, () => {
    //   console.log('--- out grid')
    // });
    console.log("--- grid", gridPosition.x, gridPosition.y);
    console.log("--- done grid", gridRectangle.x, gridRectangle.y);
    console.log("--- grid size", gridSize);
    console.log("--- rectangle size", {
      width: gridRectangle.width,
      height: gridRectangle.height,
    });
    const cellWidth = gridSize.width / gridCount.columns;
    const cellHeight = gridSize.height / gridCount.rows;

    const emptyRowsAndColumns: null[][] = new Array(this.gridCount.rows).fill(
      new Array(this.gridCount.columns).fill(null)
    );

    const rowsAndColumns = emptyRowsAndColumns.map((row, rowIndex) => {
      return row.map((blankValue, columnIndex) => {
        return {
          row: rowIndex,
          column: columnIndex,
          x:
            (columnIndex + 1) * cellWidth +
            (gridRectangle.x - gridRectangle.width / 2),
          y:
            (rowIndex + 1) * cellHeight +
            (gridRectangle.y - gridRectangle.height / 2),
        };
      });
    });
    const cells = flatten(rowsAndColumns);
    this.allCells = cells.map(({ x, y, column, row }) => {
      // const isFirstRow = row === 0;
      // const isLastRow = row + 1 === this.gridCount.rows;
      // const isFirstColumn = column === 0;
      // const isLastColumn = column + 1 === this.gridCount.columns;
      // const isEdgeCell = [
      //   isFirstRow,
      //   isLastRow,
      //   isFirstColumn,
      //   isLastColumn,
      // ].some(Boolean);

      return new BuilderCell(
        this.scene,
        { x, y },
        {
          width: cellWidth,
          height: cellWidth,
        },
        row,
        column
        // isEdgeCell
      );
    });
    this.connectCellListeners();
  }

  reset() {
    this.selectedCells.forEach((specifiedCell) => specifiedCell.deselect());
    this.selectedCells = [];
  }

  private connectCellListeners() {
    this.allCells.forEach((specifiedCell) => {
      specifiedCell.on(Phaser.Input.Events.POINTER_DOWN, () => {
        console.log("-- CLICKED", specifiedCell.id);
        this.onCellClicked(specifiedCell);
      });
      specifiedCell.on(Phaser.Input.Events.POINTER_UP, () => {
        console.log("-- RELEASED", specifiedCell.id);
        this.onCellReleased(specifiedCell);
      });
      specifiedCell.on(Phaser.Input.Events.POINTER_OUT, () => {
        console.log("--- POINTER OUT", specifiedCell.id);
        if (this.isDragging) {
          this.draggedOver.push(specifiedCell);
        }
      });
    });
  }

  private onCellReleased(cell: BuilderCell) {
    this.isDragging = false;
    this.draggedOver.push(cell);
    this.selectCells(this.draggedOver);
    this.draggedOver = [];
  }

  private selectCells(cells: BuilderCell[]) {
    cells.forEach((specifiedCell) => {
      const message = `${this.selectedCells.length + 1}`;
      specifiedCell.select(message, this.isEdgeCell(specifiedCell));
      this.selectedCells.push(specifiedCell);
    });
  }

  deselectAllCells() {
    this.selectedCells.forEach((specifiedCell) => {
      specifiedCell.deselect();
    });
    this.selectedCells = [];
  }

  private onCellClicked(cell: BuilderCell) {
    this.isDragging = true;
    // const message = `${this.selectedCells.length + 1}`;
    // cell.select(message);
    // this.selectedCells.push(cell);
  }

  private isEdgeCell(cell: BuilderCell) {
    const isFirstRow = cell.row === 0;
    const isLastRow = cell.row + 1 === this.gridCount.rows;
    const isFirstColumn = cell.column === 0;
    const isLastColumn = cell.column + 1 === this.gridCount.columns;
    return [isFirstRow, isLastRow, isFirstColumn, isLastColumn].some(Boolean);
  }
}
