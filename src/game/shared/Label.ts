import { Position, Size } from "../../utils";
import { Color, RawColor, createColorFromRaw } from "../Color";

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

export class Label extends Phaser.GameObjects.Container {
  private readonly text: Phaser.GameObjects.Text;
  private readonly onClick?: LabelOptions["onClick"];
  private readonly id: string;

  private readonly backgroundColor: RawColor;
  private readonly color: RawColor;
  private readonly disabledAlpha: number;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    text: string,
    options: Partial<LabelOptions> = {}
  ) {
    const { x, y } = position;
    const preparedOptions: LabelOptions = {
      ...labelDefaultOptions,
      ...options,
    };
    super(scene, x, y);

    const { isDisabled, disabledAlpha, onClick, id, origin, ...textOptions } =
      preparedOptions;
    const preparedId = id || text;

    const textObject = new Phaser.GameObjects.Text(
      scene,
      x,
      y,
      text,
      textOptions
    ).setOrigin(origin);
    if (isDisabled) {
      textObject.setAlpha(disabledAlpha);
    }
    this.add(textObject);
    this.scene.add.existing(textObject);

    this.text = textObject;
    this.id = preparedId;
    this.onClick = onClick;
    this.backgroundColor = textOptions.backgroundColor;
    this.color = textOptions.color;
    this.disabledAlpha = disabledAlpha;

    if (onClick) {
      this.attachCallbacks(
        scene,
        textObject,
        { onClick, id: preparedId },
        isDisabled
      );
    }
  }

  enable() {
    this.text.setAlpha(1).setInteractive();
  }

  disable() {
    this.text.setAlpha(this.disabledAlpha).disableInteractive();
  }

  private attachCallbacks(
    scene: Phaser.Scene,
    text: Phaser.GameObjects.Text,
    onClickAndId?: {
      onClick: Required<LabelOptions>["onClick"];
      id: string;
    },
    isDisabled?: boolean
  ) {
    if (!isDisabled) {
      text.setInteractive();
    }
    if (onClickAndId) {
      const { onClick, id } = onClickAndId;
      text.on(Phaser.Input.Events.POINTER_UP, () => {
        onClick(id);
      });
    }
    text.on(Phaser.Input.Events.POINTER_OVER, () => {
      // Hover in
      text.setBackgroundColor(RawColor.Success);
      text.setColor(RawColor.SuccessContrast);
    });
    text.on(Phaser.Input.Events.POINTER_OUT, () => {
      // Hover out
      text.setBackgroundColor(this.backgroundColor);
      text.setColor(this.color);
    });
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanCallbacks(text, onClickAndId?.onClick);
    });
  }

  private cleanCallbacks(
    text: Phaser.GameObjects.Text,
    onClick?: LabelOptions["onClick"]
  ) {
    text.off(Phaser.Input.Events.POINTER_OVER);
    text.off(Phaser.Input.Events.POINTER_OUT);
    if (onClick) {
      text.off(Phaser.Input.Events.POINTER_UP);
    }
  }
}
