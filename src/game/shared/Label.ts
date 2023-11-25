import { Position, Size } from "../../utils";
import { Color, RawColor, createColorFromRaw } from "../Color";
import { Sound } from "../Sound";

export type LabelOptions = {
  color: RawColor;
  backgroundColor: RawColor;
  id?: string;
  origin?: number;
  onClick?: (id: string) => void;
  isDisabled?: boolean;
  disabledAlpha: number;
} & Pick<
  Phaser.Types.GameObjects.Text.TextStyle,
  "align" | "fontSize" | "padding"
>;

const labelDefaultOptions: LabelOptions = {
  color: RawColor.Light,
  backgroundColor: RawColor.LightContrast,
  fontSize: 20,
  align: "center",
  origin: 0.5,
  disabledAlpha: 0.3,
  padding: {
    x: 10,
    y: 10,
  },
};

export class Label extends Phaser.GameObjects.Text {
  private readonly onClick?: LabelOptions["onClick"];
  private readonly id: string;

  private readonly backgroundColor: RawColor;
  private readonly color: RawColor;
  private readonly disabledAlpha: number;
  private readonly onHoverSound?: Phaser.Sound.BaseSound;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    text: string,
    options: Partial<LabelOptions> = {},
  ) {
    const { x, y } = position;
    const preparedOptions: LabelOptions = {
      ...labelDefaultOptions,
      ...options,
    };
    const { isDisabled, disabledAlpha, onClick, id, origin, ...textOptions } =
      preparedOptions;
    const preparedId = id || text;
    super(scene, x, y, text, textOptions);

    this.setOrigin(origin);
    if (isDisabled) {
      this.setAlpha(disabledAlpha);
    }
    this.scene.add.existing(this);

    this.id = preparedId;
    this.onClick = onClick;
    this.backgroundColor = textOptions.backgroundColor;
    this.color = textOptions.color;
    this.disabledAlpha = disabledAlpha;

    if (onClick) {
      this.attachCallbacks(scene, { onClick, id: preparedId }, isDisabled);
      this.onHoverSound = this.scene.sound.add(Sound.OnHover);
    }
  }

  enable() {
    this.setAlpha(1).setInteractive();
  }

  disable() {
    this.setAlpha(this.disabledAlpha).disableInteractive();
  }

  private attachCallbacks(
    scene: Phaser.Scene,
    onClickAndId?: {
      onClick: Required<LabelOptions>["onClick"];
      id: string;
    },
    isDisabled?: boolean,
  ) {
    if (!isDisabled) {
      this.setInteractive();
    }
    if (onClickAndId) {
      const { onClick, id } = onClickAndId;
      this.on(Phaser.Input.Events.POINTER_UP, () => {
        onClick(id);
      });
    }
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      // Hover in
      this.setBackgroundColor(RawColor.Success);
      this.setColor(RawColor.SuccessContrast);
      if (this.onHoverSound) {
        this.onHoverSound.play(undefined, { volume: 0.3 });
      }
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      // Hover out
      this.setBackgroundColor(this.backgroundColor);
      this.setColor(this.color);
    });
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanCallbacks(onClickAndId?.onClick);
    });
  }

  private cleanCallbacks(onClick?: LabelOptions["onClick"]) {
    this.off(Phaser.Input.Events.POINTER_OVER);
    this.off(Phaser.Input.Events.POINTER_OUT);
    if (onClick) {
      this.off(Phaser.Input.Events.POINTER_UP);
    }
  }
}
