import { Position, Size } from "../../utils";
import { BuilderCellColor } from "./BuilderCellColor";

export class BuilderCell extends Phaser.GameObjects.Container {
  readonly id: string;
  private readonly cell: Phaser.GameObjects.Rectangle;
  private text?: Phaser.GameObjects.Text;

  private isSelected = false;

  constructor(
    scene: Phaser.Scene,
    private readonly cellPosition: Position,
    private readonly cellSize: Size,
    readonly row: number,
    readonly column: number,
    private isAvailable: boolean = true
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
        isAvailable ? 0 : 0.5
      )
      .setOrigin(1)
      .setStrokeStyle(0.5, parseInt(BuilderCellColor.Common, 16));
    if (isAvailable) {
      cell.setInteractive();
    }

    cell.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.emit(Phaser.Input.Events.POINTER_OVER);
      this.onHoverIn();
    });
    cell.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.emit(Phaser.Input.Events.POINTER_OUT);
      this.onHoverOut();
    });

    cell.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.emit(Phaser.Input.Events.POINTER_DOWN);
    });
    cell.on(Phaser.Input.Events.POINTER_UP, () => {
      this.emit(Phaser.Input.Events.POINTER_UP);
    });

    this.cell = cell;
  }

  select(message: string, isEntry = false) {
    if (this.isSelected) {
      return;
    }
    this.isSelected = true;
    const hexColor = isEntry ? BuilderCellColor.Entry : BuilderCellColor.Path;
    this.cell.setFillStyle(parseInt(hexColor, 16), 0.25);
    this.text = this.scene.add
      .text(
        this.cell.x, // - cell.width / 2,
        this.cell.y, // - cell.height / 2,
        message,
        {
          color: "000000",
        }
      )
      .setOrigin(1);
  }

  deselect() {
    if (!this.isSelected) {
      return;
    }
    this.cell.setFillStyle(parseInt(BuilderCellColor.Common, 16), 0);
    this.text?.destroy(true)

  }

  private onHoverIn() {
    if (this.isSelected) {
      return;
    }
    this.cell.setFillStyle(parseInt("fcba03", 16), 0.15);
  }

  private onHoverOut() {
    if (this.isSelected) {
      return;
    }
    this.cell.setFillStyle(parseInt("000000", 16), 0);
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
