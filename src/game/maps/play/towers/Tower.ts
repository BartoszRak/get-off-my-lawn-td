import { Position, Size } from "../../../../utils";
import { Color } from "../../../Color";
import { Image } from "../../../Images";
import { TowerTemplate } from "./TowerTemplate";

export interface TowerOptions {
  showOutline: boolean;
}

const defaultOptions: TowerOptions = {
  showOutline: true,
};

export class Tower extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly base: Phaser.GameObjects.Image;
  private readonly barrel: Phaser.GameObjects.Image;
  private readonly options: TowerOptions;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    private readonly data: TowerTemplate,
    options: Partial<TowerOptions> = defaultOptions
  ) {
    super(scene);
    this.options = { ...options, ...defaultOptions };

    this.wrapper = this.createWrapper();
    this.base = this.createImage(data.images.base, this.size);
    this.barrel = this.createImage(data.images.barrel, this.size);

    this.addMultiple([this.wrapper, this.base, this.barrel]);
  }

  private createImage(imageSource: Image, size: Size) {
    const { x, y } = this.position;
    const { width, height } = size;
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
    this.scene.add.existing(wrapper);

    return wrapper;
  }
}
