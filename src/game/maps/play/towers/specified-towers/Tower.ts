import { Position, Size, isDefined } from "../../../../../utils";
import { Color } from "../../../../Color";
import { Image } from "../../../../Image";
import { TowerImage } from "../../../../TowerImage";
import { TowerTemplate } from "../TowerTemplate";

export interface TowerOptions {
  showOutline: boolean;
  displayRange?: boolean;
}

const defaultOptions: TowerOptions = {
  showOutline: true,
  displayRange: true,
};

export class Tower extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly base: Phaser.GameObjects.Image;
  private readonly barrel: Phaser.GameObjects.Image;
  private readonly range?: Phaser.GameObjects.Arc;
  private readonly options: TowerOptions;
  private readonly baseChildrens: (
    | Phaser.GameObjects.Rectangle
    | Phaser.GameObjects.Image
  )[];

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    private readonly data: TowerTemplate,
    options: Partial<TowerOptions> = defaultOptions,
    private level = 0
  ) {
    super(scene);
    const mergedOptions = { ...options, ...defaultOptions };
    this.options = mergedOptions;

    this.wrapper = this.createWrapper();
    this.base = this.createImage(data.levels[level].images.base, this.size);
    this.barrel = this.createImage(data.levels[level].images.barrel, this.size);
    if (mergedOptions.displayRange) {
      this.range = this.createRange(scene, position, data.levels[level].range);
    }

    this.baseChildrens = [this.wrapper, this.base, this.barrel];
    this.addMultiple([...this.baseChildrens, this.range].filter(isDefined));
  }

  getMaxLevel() {
    return this.data.levels.length - 1;
  }

  setAlpha(value: number, step?: number | undefined): this {
    this.baseChildrens.forEach((specifiedChild, index) => {
      const newAlpha = step ? value + index * step : value;
      specifiedChild.setAlpha(newAlpha);
    });
    return this;
  }

  private createImage(imageSource: TowerImage, size: Size) {
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

  private createRange(scene: Phaser.Scene, position: Position, range: number) {
    const { x, y } = position;
    const arc = new Phaser.GameObjects.Arc(scene, x, y, range)
      .setFillStyle(Color.Error)
      .setAlpha(0.15);
    this.scene.add.existing(arc);
    return arc;
  }
}
