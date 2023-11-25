import { Position, Size } from "../../../../utils";
import { Color, RawColor } from "../../../Color";
import { Tower } from "./specified-towers/Tower";
import { TowerTemplate } from "./TowerTemplate";

export interface TowerTileOptions {
  percentageSizeOfTower: number;
  onClick?: (tile: TowerTile) => void;
  strokeWidth: number;
  disabled?: boolean;
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
    public readonly data: TowerTemplate,
    options: Partial<TowerTileOptions> = defaultOptions,
  ) {
    super(scene);
    const preparedOptions = { ...defaultOptions, ...options };
    const preparedSize = {
      width: size.width - 2 * preparedOptions.strokeWidth,
      height: size.height - 2 * preparedOptions.strokeWidth,
    };
    this.size = preparedSize;
    this.options = preparedOptions;
    this.wrapper = this.createWrapper(options.disabled);
    const { tower, towerWrapper } = this.createTower(
      scene,
      data,
      position,
      preparedSize,
      preparedOptions,
    );
    this.tower = tower;
    this.text = this.createDescription(data.name, data.levels[0].cost);

    if (!preparedOptions.disabled) {
      this.attachCallbacks(this.wrapper, this.text);
    }

    this.addMultiple([this.wrapper, this.text, towerWrapper]);
  }

  couldBeBought(balance: number) {
    return this.data.levels[0].cost <= balance;
  }

  enable() {
    if (!this.options.disabled) {
      return;
    }
    this.options.disabled = false;
    this.wrapper
      .setStrokeStyle(this.options.strokeWidth, this.color)
      .setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      });
    this.attachCallbacks(this.wrapper, this.text);
  }

  disable() {
    if (this.options.disabled) {
      return;
    }
    this.options.disabled = true;
    this.wrapper
      .setStrokeStyle(this.options.strokeWidth, Color.Error)
      .setInteractive({
        cursor: "url(assets/cursor_pointerFlat.png), default",
      });
    this.cleanCallbacks(this.wrapper);
  }

  private attachCallbacks(
    wrapper: Phaser.GameObjects.Rectangle,
    text: Phaser.GameObjects.Text,
  ) {
    const { onClick } = this.options;
    if (onClick) {
      wrapper.on(
        Phaser.Input.Events.POINTER_UP,
        (pointer: Phaser.Input.Pointer) => {
          if (pointer.leftButtonReleased()) {
            onClick(this);
          }
        },
      );
    }
    wrapper.on(Phaser.Input.Events.POINTER_OVER, () => {
      wrapper.setStrokeStyle(2, this.hoverColor);
      text.setBackgroundColor(this.rawHoverColor);
      text.setColor(RawColor.LightContrast);
    });
    wrapper.on(Phaser.Input.Events.POINTER_OUT, () => {
      wrapper.setStrokeStyle(2, this.color);
      text.setBackgroundColor(this.rawColor);
      text.setColor(RawColor.Light);
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
      backgroundColor: this.rawColor,
      color: RawColor.LightText,
      fontSize: 13,
      fixedWidth: this.size.width,
      fixedHeight: height,
      align: "center",
      padding: {
        x: 5,
        y: 5,
      },
    });
    this.scene.add.existing(text);
    return text;
  }

  private createTower(
    scene: Phaser.Scene,
    data: TowerTemplate,
    position: Position,
    size: Size,
    options: TowerTileOptions,
  ) {
    const width = options.percentageSizeOfTower * size.width;
    const height = options.percentageSizeOfTower * size.height;
    const x = position.x + size.width / 2;
    const y = position.y + size.height / 2;
    const towerWrapper = this.createTileWrapper({ x, y }, { width, height });
    const tower = new Tower(
      scene,
      {
        x,
        y,
      },
      {
        width,
        height,
      },
      data,
    );

    return { tower, towerWrapper };
  }

  private createTileWrapper(position: Position, size: Size) {
    const { x, y } = position;
    const { width, height } = size;
    const wrapper = new Phaser.GameObjects.Rectangle(
      this.scene,
      x,
      y,
      width,
      height,
    ).setFillStyle(Color.Light);

    this.scene.add.existing(wrapper);

    return wrapper;
  }

  private createWrapper(disabled?: boolean) {
    const { x, y } = this.position;
    const { width, height } = this.size;
    const wrapper = new Phaser.GameObjects.Rectangle(
      this.scene,
      x,
      y,
      width,
      height,
    )
      .setStrokeStyle(
        this.options.strokeWidth,
        disabled ? Color.Error : this.color,
      )
      .setFillStyle(Color.Dark)
      .setOrigin(0);
    if (!disabled) {
      wrapper.setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      });
    }
    this.scene.add.existing(wrapper);

    return wrapper;
  }
}
