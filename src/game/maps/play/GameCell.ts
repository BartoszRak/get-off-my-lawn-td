import { Position, Size } from "../../../utils";
import { Color } from "../../Color";
import { CellId } from "../CellId";

export class GameCell extends Phaser.GameObjects.Rectangle {
  constructor(
    scene: Phaser.Scene,
    public readonly id: CellId,
    cellPosition: Position,
    cellSize: Size,
    public readonly isPath = false,
    public readonly isStart = false,
    public readonly isEnd = false
  ) {
    const getColor = () => {
      if (isPath) {
        if (isStart) {
          return Color.Success;
        }
        if (isEnd) {
          return Color.Error;
        }
        return Color.Background;
      }

      return Color.Grey;
    };
    const color = getColor();

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
