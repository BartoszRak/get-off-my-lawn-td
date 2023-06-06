import { Position, Size } from "../../../utils";

export class GameCell extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    private readonly cellPosition: Position,
    private readonly cellSize: Size,
    private readonly isPath = false,
    private readonly isStart = false,
    private readonly isEnd = false
  ) {
    super(scene);

    const rawColor = this.getRawColor();
    const color = parseInt(rawColor, 16);
    this.scene.add.rectangle(
      cellPosition.x,
      cellPosition.y,
      cellSize.width,
      cellSize.height,
      color,
      1
    );
  }

  private getRawColor() {
    if (this.isPath) {
      if (this.isStart) {
        return "00FF00";
      }
      if (this.isEnd) {
        return "FF0000";
      }
      return "FFFFFF";
    }

    return "DDDDDD";
  }
}
