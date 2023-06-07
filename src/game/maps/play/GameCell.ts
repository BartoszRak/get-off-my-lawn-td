import { Position, Size } from "../../../utils";

export class GameCell extends Phaser.GameObjects.Rectangle {
  constructor(
    scene: Phaser.Scene,
    cellPosition: Position,
    cellSize: Size,
    isPath = false,
    isStart = false,
    isEnd = false
  ) {
    const getRawColor = () => {
      if (isPath) {
        if (isStart) {
          return "00FF00";
        }
        if (isEnd) {
          return "FF0000";
        }
        return "FFFFFF";
      }

      return "DDDDDD";
    };
    const rawColor = getRawColor();
    const color = parseInt(rawColor, 16);

    super(
      scene,
      cellPosition.x,
      cellPosition.y,
      cellSize.width,
      cellSize.height,
      color,
      isStart || isEnd ? 0.2 : 1
    );
  }
}
