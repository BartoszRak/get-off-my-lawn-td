import { flatten } from "lodash";
import { Position, PositionAndSize, Size } from "../../utils";
import { Image, Images } from "../Images";
import { SceneKey } from "../SceneKey";
import { Button } from "../menu/Button";

export class CreateMapScene extends Phaser.Scene {
  private readonly gridSize: Size = { width: 25, height: 25 };
  private readonly planeWidthPercentage = 0.6;
  private readonly selectedCells: Phaser.GameObjects.Image[] = [];

  private readonly firstActiveCellColor = "0000FF";
  private readonly lastActiveCellColor = "00FF00";
  private readonly activeCellColor = "FF0000";
  private isDragging = false;

  constructor() {
    super({
      key: SceneKey.CreateMap,
    });
  }

  preload() {
    this.load.image(...Images[Image.GlassPanel]);
  }

  create() {
    this.input.setDefaultCursor("url(assets/cursor_pointerFlat.png), default");
    this.createButtons();
    this.createGrid();
  }

  private createGrid() {
    const { width, height } = this.scale;
    const planeWidth = width * this.planeWidthPercentage;
    const cellWidth = planeWidth / this.gridSize.width;
    const emptyRowsAndColumns: null[][] = new Array(this.gridSize.height).fill(
      new Array(this.gridSize.width).fill(null)
    );

    const rowsAndColumns = emptyRowsAndColumns.map((row, rowIndex) => {
      return row.map((cell, columnIndex): Position => {
        return {
          x: columnIndex * cellWidth + (width - planeWidth) / 2,
          y: rowIndex * cellWidth + (height - planeWidth) / 2,
        };
      });
    });
    const cells = flatten(rowsAndColumns);
    cells.forEach((specifiedCell) =>
      this.createCell({
        ...specifiedCell,
        width: cellWidth,
        height: cellWidth,
      })
    );
  }

  private createCell({ x, y, width, height }: PositionAndSize) {
    const cell = this.add
      .image(x, y, Image.GlassPanel)
      .setDisplaySize(width, height)
      .setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      })
      .setOrigin(0.5);

    cell.on(Phaser.Input.Events.POINTER_OVER, () => {
      cell.setTintFill(parseInt("fcba03", 16));
    });
    cell.on(Phaser.Input.Events.POINTER_OUT, () => {
      cell.clearTint();
    });
    cell.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.makeCellSelected(cell);
    });
    cell.on(Phaser.Input.Events.POINTER_UP, () => {
      this.makeCellSelected(cell);
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      cell.off(Phaser.Input.Events.POINTER_OVER);
      cell.off(Phaser.Input.Events.POINTER_OUT);
      cell.off(Phaser.Input.Events.POINTER_DOWN);
    });
  }

  private makeCellSelected(cell: Phaser.GameObjects.Image) {
    cell.off(Phaser.Input.Events.POINTER_OVER);
    cell.off(Phaser.Input.Events.POINTER_OUT);

    cell.setTintFill(
      parseInt(this.pickNextActiveCellColour(), 16)
    );
    const text = this.add
      .text(
        cell.x, // - cell.width / 2,
        cell.y, // - cell.height / 2,
        `${this.selectedCells.length + 1}`
      )
      .setOrigin(0.5);
    this.selectedCells.push(cell);
  }

  private pickNextActiveCellColour(): string {
    const isFirst = !this.selectedCells.length;
    if (isFirst) {
      return this.firstActiveCellColor;
    }
    return this.activeCellColor;
  }

  private createButtons() {
    new Button(
      this,
      {
        text: "BACK",
        onClick: () => this.goBackToMenu(),
      },
      { x: 100, y: 50 },
      undefined
    );
  }

  private goBackToMenu() {
    this.scene.manager.switch(this.scene.key, SceneKey.MainMenu);
  }
}
