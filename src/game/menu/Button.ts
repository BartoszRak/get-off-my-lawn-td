import { Position, Size, isDefined } from "../../utils";
import { Image } from "../Images";
import { ButtonDefaultSize } from "./ButtonDefaultSize";

interface ButtonConfig {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export class Button extends Phaser.GameObjects.Container {
  private readonly button: Phaser.GameObjects.Image;
  private readonly text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    private readonly config: ButtonConfig,
    { x, y }: Position,
    { width, height }: Size = ButtonDefaultSize
  ) {
    super(scene);

    const { onClick, text, disabled } = config;
    const button = this.scene.add
      .image(x, y, Image.GlassPanel)
      .setDisplaySize(width, height)
      .setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      })
      .setOrigin(0.5);
    const buttonText = this.scene.add
      .text(button.x, button.y, text, {
        color: "000000",
      })
      .setOrigin(0.5);

    if (isDefined(onClick)) {
      button.on(Phaser.Input.Events.POINTER_UP, () => {
        onClick();
      });
    }
    button.on(Phaser.Input.Events.POINTER_OVER, () => {
      button.setTintFill(parseInt("00FF00", 16));
    });
    button.on(Phaser.Input.Events.POINTER_OUT, () => {
      button.clearTint();
    });
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      button.off(Phaser.Input.Events.POINTER_OVER);
      button.off(Phaser.Input.Events.POINTER_OUT);
      if (isDefined(onClick)) {
        button.off(Phaser.Input.Events.POINTER_UP);
      }
    });

    this.button = button;
    this.text = buttonText;

    if (disabled) {
      this.disable();
    }
  }

  disable() {
    console.log('---disable()', this.text)
    this.disconnectOnClick();
    this.text.setAlpha(0.2);
  }

  enable() {
    console.log('---enable()', this.text)
    this.connectOnClick();
    this.text.setAlpha(1);
  }

  private connectOnClick() {
    const { onClick } = this.config;
    if (isDefined(onClick)) {
      this.button.on(Phaser.Input.Events.POINTER_UP, () => {
        onClick();
      });
    }
  }

  private disconnectOnClick() {
    this.button.off(Phaser.Input.Events.POINTER_UP);
  }
}
