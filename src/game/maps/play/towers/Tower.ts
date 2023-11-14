import { Position, Size } from "../../../../utils";
import { Color } from "../../../Color";
import { Image } from "../../../Images";
import { TowerTemplate } from "./TowerTemplate";

export class Tower extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly base: Phaser.GameObjects.Image;
  private readonly barrel: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    private readonly data: TowerTemplate
  ) {
    super(scene);
    this.wrapper = this.createWrapper();
    this.base = this.createImage(data.images.base);
    this.barrel = this.createImage(data.images.barrel);

    this.addMultiple([this.wrapper, this.base, this.barrel]);
  }

  private createImage(imageSource: Image) {
    const { x, y } = this.position;
    const { width, height } = this.size;
    const image = new Phaser.GameObjects.Image(
      this.scene,
      x,
      y,
      imageSource
    ).setDisplaySize(width, height);
    this.scene.add.existing(image);

    return image;
  }

  private createWrapper() {
    const { x, y } = this.position;
    const { width, height } = this.size;
    const wrapper = new Phaser.GameObjects.Rectangle(
      this.scene,
      x,
      y,
      width,
      height
    ).setStrokeStyle(2, Color.Contour);
    this.scene.add.existing(this.wrapper);

    return wrapper;
  }
}
