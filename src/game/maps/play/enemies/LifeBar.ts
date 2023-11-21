import { wrap } from "module";
import { Position, Size } from "../../../../utils";
import { Color } from "../../../Color";

export class LifeBar extends Phaser.GameObjects.Container {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly bar: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    private readonly size: Size,
    private lifePercentage: number
  ) {
    super(scene, position.x, position.y);
    const { x, y } = position;
    const { width, height } = size;
    const bar = new Phaser.GameObjects.Rectangle(
      scene,
      0 - width / 2,
      0,
      width * lifePercentage,
      height,
      Color.Error
    ).setOrigin(0, 0.5);
    const wrapper = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      width,
      height
    ).setStrokeStyle(1, Color.Dark);
    scene.add.existing(bar);
    scene.add.existing(wrapper);

    this.add([bar, wrapper]);
    this.bar = bar;
    this.wrapper = wrapper;

    scene.add.existing(this);
  }

  setLife(percentage: number) {
    this.lifePercentage = percentage;
    this.updateBarSize(percentage);
  }

  private updateBarSize(percentage: number) {
    this.bar.setSize(this.size.width * percentage, this.size.height);
  }
}
