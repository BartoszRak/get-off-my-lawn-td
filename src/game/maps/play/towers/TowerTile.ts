import { Position, Size } from "../../../../utils";
import { Color, RawColor } from "../../../Color";
import { Tower } from "./Tower";
import { TowerTemplate } from "./TowerTemplate";

export interface TowerTileOptions {
  percentageSizeOfTower: number;
  onClick?: (data: TowerTemplate, tile: TowerTile) => void;
  strokeWidth: number;
}

const defaultOptions: TowerTileOptions = {
  percentageSizeOfTower: 0.8,
  strokeWidth: 2,
};

export class TowerTile extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly tower: Tower;
  private readonly options: TowerTileOptions;
  private readonly text: Phaser.GameObjects.Text;
  private readonly size: Size;

  private readonly hoverColor = Color.Success;
  private readonly color = Color.Dark;
  private readonly rawHoverColor = RawColor.Success;
  private readonly rawColor = RawColor.Dark;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    size: Size,
    private readonly data: TowerTemplate,
    options: Partial<TowerTileOptions> = defaultOptions
  ) {
    super(scene);
    const preparedOptions = { ...defaultOptions, ...options };
    const preparedSize = {
      width: size.width - 2 * preparedOptions.strokeWidth,
      height: size.height - 2 * preparedOptions.strokeWidth,
    };
    this.size = preparedSize;
    this.options = preparedOptions;
    this.tower = this.createTower(
      scene,
      data,
      position,
      preparedSize,
      preparedOptions
    );
    this.text = this.createDescription(data.name, data.cost);
    this.wrapper = this.createWrapper();

    this.attachCallbacks(this.wrapper, this.text);

    this.addMultiple([this.wrapper, this.text]);
  }

  private attachCallbacks(
    wrapper: Phaser.GameObjects.Rectangle,
    text: Phaser.GameObjects.Text
  ) {
    const { onClick } = this.options;
    if (onClick) {
      wrapper.on(Phaser.Input.Events.POINTER_UP, () => {
        onClick(this.data, this);
      });
    }
    wrapper.on(Phaser.Input.Events.POINTER_OVER, () => {
      wrapper.setStrokeStyle(2, this.hoverColor);
      text.setBackgroundColor(`#${this.rawHoverColor}`);
      text.setColor(`#${RawColor.LightContrast}`);
    });
    wrapper.on(Phaser.Input.Events.POINTER_OUT, () => {
      wrapper.setStrokeStyle(2, this.color);
      text.setBackgroundColor(`#${this.rawColor}`);
      text.setColor(`#${RawColor.Light}`);
    });
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanCallbacks(wrapper);
    });
  }

  private cleanCallbacks(wrapper: Phaser.GameObjects.Rectangle) {
    const { onClick } = this.options;
    wrapper.off(Phaser.Input.Events.POINTER_OVER);
    wrapper.off(Phaser.Input.Events.POINTER_OUT);
    if (onClick) {
      wrapper.off(Phaser.Input.Events.POINTER_UP);
    }
  }

  private createDescription(name: string, cost: number) {
    const height = this.size.height / 6;
    const x = this.position.x;
    const y = this.position.y + this.size.height - height;
    const description = `${name.toUpperCase()}(${cost}$)`;
    const text = new Phaser.GameObjects.Text(this.scene, x, y, description, {
      backgroundColor: `#${this.rawColor}`,
      color: `#${RawColor.LightText}`,
      fontSize: 11,
      fixedWidth: this.size.width,
      fixedHeight: height,
      align: "center",
    });
    this.scene.add.existing(text);
    return text;
  }

  private createTower(
    scene: Phaser.Scene,
    data: TowerTemplate,
    position: Position,
    size: Size,
    options: TowerTileOptions
  ) {
    const width = options.percentageSizeOfTower * size.width;
    const height = options.percentageSizeOfTower * size.height;
    const x = position.x + size.width / 2;
    const y = position.y + size.height / 2;
    return new Tower(
      scene,
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
      .setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      })
      .setStrokeStyle(this.options.strokeWidth, this.color)
      .setOrigin(0);
    this.scene.add.existing(wrapper);

    return wrapper;
  }
}
