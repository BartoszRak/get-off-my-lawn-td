import { Position, Size } from "../../../../utils";
import { Color, RawColor } from "../../../Color";
import { Tower } from "./Tower";
import { TowerTemplate } from "./TowerTemplate";

export interface TowerTileOptions {
  percentageSizeOfTower: number;
}

const defaultOptions: TowerTileOptions = {
  percentageSizeOfTower: 0.8,
};

export class TowerTile extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly tower: Tower;
  private readonly options: TowerTileOptions;
  private readonly text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    private readonly data: TowerTemplate,
    options: Partial<TowerTileOptions> = defaultOptions
  ) {
    super(scene);
    this.options = { ...defaultOptions, ...options };
    this.wrapper = this.createWrapper();
    this.tower = this.createTower(data);
    this.text = this.createDescription(data.name, data.cost);

    this.addMultiple([this.wrapper, this.text]);
  }

  private createDescription(name: string, cost: number) {
    const height = this.size.height / 6;
    const x = this.position.x;
    const y = this.position.y + this.size.height - height;
    const description = `${name.toUpperCase()}(${cost}$)`;
    const text = new Phaser.GameObjects.Text(this.scene, x, y, description, {
      backgroundColor: RawColor.Contour,
      color: `#${RawColor.LightText}`,
      fontSize: 11,
      fixedWidth: this.size.width,
      fixedHeight: height,
      align: "center",
    });
    this.scene.add.existing(text);
    return text;
  }

  private createTower(data: TowerTemplate) {
    const width = this.options.percentageSizeOfTower * this.size.width;
    const height = this.options.percentageSizeOfTower * this.size.height;
    const x = this.wrapper.x + this.wrapper.width / 2;
    const y = this.wrapper.y + this.wrapper.height / 2;
    return new Tower(
      this.scene,
      {
        x,
        y,
      },
      {
        width,
        height,
      },
      data
    );
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
    )
      .setStrokeStyle(2, Color.Success)
      .setOrigin(0);
    this.scene.add.existing(wrapper);

    return wrapper;
  }
}
