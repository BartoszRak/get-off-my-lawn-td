import { isDefined } from "../../utils";
import { SceneKey } from "../SceneKey";

enum MainMenuImage {
  GlossPanel = "gloss-panel",
  DefaultCursor = "DefaultCursor",
  PointerCursor = "PointerCursor",
}

interface ButtonWithText {
  button: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
}

interface ButtonConfig {
  text: string;
  onClick?: () => void;
}

export class MainMenuScene extends Phaser.Scene {
  private buttons: ButtonWithText[] = [];
  private buttonSize: { width: number; height: number } = {
    width: 150,
    height: 50,
  };
  private buttonMarginY: number = 40;

  constructor() {
    super({
      key: SceneKey.MainMenu,
    });
  }

  preload() {
    this.load.image(MainMenuImage.GlossPanel, "assets/glassPanel.png");
    this.load.image(
      MainMenuImage.DefaultCursor,
      "assets/cursor_pointerFlat.png"
    );
    this.load.image(MainMenuImage.PointerCursor, "assets/cursor_hand.png");
  }

  create() {
    const { width, height } = this.scale;
    this.input.setDefaultCursor("url(assets/cursor_pointerFlat.png), default");

    this.add
      .text(width / 2, 100, "MENU", {
        fontSize: 100,
      })
      .setOrigin(0.5);
    this.createButtons([
      {
        text: "Start",
        onClick: () => {
          console.log("--- START CLICKED");
        },
      },
      {
        text: "Settings",
        onClick: () => {
          console.log("--- SETTINGS CLICKED");
        },
      },
      {
        text: "Exit",
        onClick: () => {
          console.log("--- EXIT CLICKED");
        },
      },
    ]);
  }

  private createButtons(buttonConfigs: ButtonConfig[]) {
    const { width, height } = this.scale;
    const fullHeight =
      buttonConfigs.length * (this.buttonSize.height + this.buttonMarginY) -
      this.buttonMarginY;
    const blockY = height / 2 - fullHeight / 2;
    buttonConfigs.forEach((specifiedConfig, index) => {
      const x = width / 2;
      const y =
        blockY +
        this.buttonSize.height / 2 +
        (this.buttonSize.height + this.buttonMarginY) * index;
      const createdButton = this.createButton(x, y, specifiedConfig);
      this.buttons.push(createdButton);
    });
  }

  private createButton(
    x: number,
    y: number,
    { text, onClick }: ButtonConfig
  ): ButtonWithText {
    const button = this.add
      .image(x, y, MainMenuImage.GlossPanel)
      .setDisplaySize(this.buttonSize.width, this.buttonSize.height)
      .setOrigin(0.5)
      .setInteractive({
        cursor: "url(assets/cursor_hand.png), default",
      });

    if (isDefined(onClick)) {
      button.on(Phaser.Input.Events.POINTER_DOWN, () => {
        onClick();
      });
    }

    button.on(Phaser.Input.Events.POINTER_OVER, () => {
      button.setTintFill(parseInt("00FF00", 16));
    });
    button.on(Phaser.Input.Events.POINTER_OUT, () => {
      button.clearTint();
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      button.off(Phaser.Input.Events.POINTER_OVER);
      button.off(Phaser.Input.Events.POINTER_OUT);
      if (isDefined(onClick)) {
        button.off(Phaser.Input.Events.POINTER_DOWN);
      }
    });
    const buttonText = this.add.text(button.x, button.y, text).setOrigin(0.5);

    return {
      button,
      text: buttonText,
    };
  }
}
