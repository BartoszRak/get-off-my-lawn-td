import { Position, Size } from "../../../utils";
import { Color, RawColor } from "../../Color";

export class WaveTile extends Phaser.GameObjects.Group {
  private readonly text: Phaser.GameObjects.Text;
  private readonly rectangle: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    { x, y }: Position,
    { width, height }: Size,
    private waveName: string
  ) {
    const rectangle = new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      width,
      height,
      Color.Success
    ).setStrokeStyle(1, Color.Contour);
    const text = new Phaser.GameObjects.Text(scene, x, y, waveName, {
      color: RawColor.Contour,
      fontSize: 20,
    }).setOrigin(0.5);
    super(scene, [rectangle, text]);

    this.rectangle = rectangle;
    this.text = text;

    scene.add.existing(this);
    scene.add.existing(rectangle);
    scene.add.existing(text);
  }

  setMask(...args: Parameters<Phaser.GameObjects.Text['setMask']>) {
    this.text.setMask(...args)
    this.rectangle.setMask(...args)
  }
}
