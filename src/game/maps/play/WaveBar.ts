import { Position, Size } from "../../../utils";
import { Color } from "../../Color";

export class WavesBar extends Phaser.GameObjects.Rectangle {
  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    private readonly maxWavesDisplay = 2,
    private readonly margin = 10,
    private readonly wave = 0,
    private readonly waveTimeInMs = 20000
  ) {
    const { x, y } = position;
    const { width, height } = size;
    super(
      scene,
      x - margin,
      y + margin,
      width + 2 * margin,
      height + 2 * margin
    );

    this.setStrokeStyle(3, Color.Contour);

    this.createPointer();
  }

  start() {
    
  }

  update() {

  }

  private createPointer() {
    const startPoint: Position = {
      x: this.x,
      y: this.y - this.height / 2,
    };
    const endPoint: Position = {
      x: this.x,
      y: this.y,
    };
    const path = new Phaser.Curves.Path(startPoint.x, startPoint.y);
    path.lineTo(endPoint.x, endPoint.y);

    const graphics = this.scene.add.graphics({
      lineStyle: {
        width: 3,
        color: Color.Contour,
      },
    });
    path.draw(graphics);
  }
}
