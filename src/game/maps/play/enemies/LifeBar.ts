import { Position, Size } from "../../../../utils";
import { Color } from "../../../Color";

export class LifeBar extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly bar: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    private readonly size: Size,
    private lifePercentage: number
  ) {
    super(scene);
    const { x, y } = position;
    const { width, height } = size;
    const bar = new Phaser.GameObjects.Rectangle(
      scene,
      x - width / 2,
      y,
      width * lifePercentage,
      height,
      Color.Error
    ).setOrigin(0, 0.5);
    const wrapper = new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      width,
      height
    ).setStrokeStyle(1, Color.Dark);

    this.addMultiple([bar, wrapper]);
    this.bar = bar;
    this.wrapper = wrapper;

    scene.add.existing(this);
  }

  setPosition(x: number, y: number) {
    this.wrapper.setPosition(x, y);
    this.bar.setPosition(x - this.size.width / 2, y);
  }

  setLife(percentage: number) {
    this.lifePercentage = percentage;
    this.updateBarSize(percentage);
  }

  private updateBarSize(percentage: number) {
    this.bar.setSize(this.size.width * percentage, this.size.height);
  }
}
