import { Position, Size } from "../../utils";
import { BuilderCell } from "./BuilderCell";

export class BuilderGrid extends Phaser.GameObjects.Container {
  private readonly allCells: BuilderCell[] = [];
  private selectedCells: BuilderCell[] = [];
  private startingCell?: BuilderCell;
  private endingCell?: BuilderCell;

  constructor(
    { x, y }: Position,
    { width, height }: Size,
    scene: Phaser.Scene
  ) {
    super(scene);

    this.scene.add.rectangle(x,y, width, height, parseInt('FF0000', 16), 0.1).setOrigin(0.5);
  }

  reset() {
    this.selectedCells.forEach((specifiedCell) => specifiedCell.deselect());
    this.selectedCells = [];
  }
}
