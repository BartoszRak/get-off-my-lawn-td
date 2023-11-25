import { Position, Size, isDefined } from "../../../utils";
import { BuilderCellColor } from "./BuilderCellColor";
import { ExportedCell } from "./ExportedCell";

export class BuilderCell extends Phaser.GameObjects.Container {
  readonly id: string;
  private readonly cell: Phaser.GameObjects.Rectangle;
  private text?: Phaser.GameObjects.Text;

  private isSelected = false;
  private isHighlighted = false;
  public isEntry = false;
  public isStaged = false;

  constructor(
    scene: Phaser.Scene,
    private readonly cellPosition: Position,
    private readonly cellSize: Size,
    readonly row: number,
    readonly column: number,
    private isAvailable: boolean = true,
  ) {
    super(scene);
    this.id = `${row}-${column}`;

    const cell = this.scene.add
      .rectangle(
        cellPosition.x,
        cellPosition.y,
        cellSize.width,
        cellSize.height,
        parseInt(BuilderCellColor.Common, 16),
        isAvailable ? 0 : 0.5,
      )
      .setOrigin(1)
      .setStrokeStyle(0.5, parseInt(BuilderCellColor.Common, 16));
    if (isAvailable) {
      cell.setInteractive();
    }

    cell.on(Phaser.Input.Events.POINTER_OVER, (ctx: any) => {
      this.emit(Phaser.Input.Events.POINTER_OVER, ctx);
      if (!this.isHighlighted) {
        this.hover();
      }
    });
    cell.on(Phaser.Input.Events.POINTER_OUT, (ctx: any) => {
      this.emit(Phaser.Input.Events.POINTER_OUT, ctx);
      if (!this.isHighlighted) {
        this.unhover();
      }
    });

    cell.on(Phaser.Input.Events.POINTER_DOWN, (ctx: any) => {
      this.emit(Phaser.Input.Events.POINTER_DOWN, ctx);
    });
    cell.on(Phaser.Input.Events.POINTER_UP, (ctx: any) => {
      this.emit(Phaser.Input.Events.POINTER_UP, ctx);
    });

    this.cell = cell;
  }

  isNeighbourOf(cell: BuilderCell) {
    const rowDiff = Math.abs(this.row - cell.row);
    const columnDiff = Math.abs(this.column - cell.column);
    return (
      (rowDiff <= 1 && columnDiff === 0) || (rowDiff === 0 && columnDiff <= 1)
    );
  }

  export(): ExportedCell {
    const isPath = this.isStaged;
    return {
      id: this.id,
      column: this.column,
      row: this.row,
      ...this.cellPosition,
      ...this.cellSize,
      isEntry: isPath ? this.isEntry : false,
      isPath,
    };
  }

  switchEntry() {
    this.isEntry ? this.unmarkAsEntry() : this.markAsEntry();
  }

  private markAsEntry() {
    this.isEntry = true;
    this.text = this.scene.add
      .text(
        this.cell.x, // - cell.width / 2,
        this.cell.y, // - cell.height / 2,
        "ENTRY",
        {
          color: "000000",
        },
      )
      .setOrigin(1);
  }

  private unmarkAsEntry() {
    this.isEntry = false;
    if (isDefined(this.text)) {
      this.text.destroy(true);
      this.text = undefined;
    }
  }

  stage() {
    if (this.isStaged) {
      return;
    }
    this.isStaged = true;
    this.cell.setStrokeStyle(1, parseInt(BuilderCellColor.Staged, 16));
  }

  unstage() {
    if (!this.isStaged) {
      return;
    }
    this.isStaged = false;
    this.cell.setStrokeStyle(0.5, parseInt(BuilderCellColor.Common, 16));
  }

  select(message: string, isEntry = false) {
    if (this.isSelected) {
      return;
    }
    this.isSelected = true;
    const hexColor = isEntry ? BuilderCellColor.Entry : BuilderCellColor.Path;
    this.cell.setFillStyle(parseInt(hexColor, 16), 0.25);
    // this.text = this.scene.add
    //   .text(
    //     this.cell.x, // - cell.width / 2,
    //     this.cell.y, // - cell.height / 2,
    //     message,
    //     {
    //       color: "000000",
    //     }
    //   )
    //   .setOrigin(1);
  }

  deselect() {
    if (!this.isSelected) {
      return;
    }
    this.cell.setFillStyle(parseInt(BuilderCellColor.Common, 16), 0);
    this.text?.destroy(true);
    this.text = undefined;
    this.unstage();
  }

  highlight() {
    if (this.isSelected) {
      // console.log("--- going b, selected");
      return;
    }
    this.isHighlighted = true;
    this.cell.setFillStyle(parseInt(BuilderCellColor.Hover, 16), 0.15);
  }

  unhighlight() {
    if (this.isSelected) {
      return;
    }
    this.isHighlighted = false;
    this.cell.setFillStyle(parseInt(BuilderCellColor.Hover, 16), 0);
  }

  private hover() {
    if (this.isSelected) {
      // console.log("--- going b, selected");
      return;
    }
    this.cell.setFillStyle(parseInt(BuilderCellColor.Hover, 16), 0.15);
  }

  private unhover() {
    if (this.isSelected) {
      return;
    }
    this.cell.setFillStyle(parseInt(BuilderCellColor.Hover, 16), 0);
  }

  private makeAvailable() {
    this.isAvailable = true;
    this.cell.setInteractive();
    this.cell.setFillStyle(parseInt(BuilderCellColor.Common, 16), 0);
  }

  private makeUnavailable() {
    this.isAvailable = false;
    this.cell.disableInteractive();
    this.cell.setFillStyle(parseInt(BuilderCellColor.Common, 16), 0.5);
  }
}
