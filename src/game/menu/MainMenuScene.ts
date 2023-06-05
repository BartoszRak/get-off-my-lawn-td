import { isDefined } from "../../utils";
import { Image, Images } from "../Images";
import { SceneKey } from "../SceneKey";
import { Button } from "./Button";

interface ButtonWithText {
  button: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
}

interface ButtonConfig {
  text: string;
  onClick?: () => void;
}

export class MainMenuScene extends Phaser.Scene {
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
    this.load.image(...Images[Image.GlassPanel]);
    this.load.image(...Images[Image.PointerFlat]);
    this.load.image(...Images[Image.CursorHand]);
  }

  create() {
    const { width, height } = this.scale;
    this.input.setDefaultCursor("url(assets/cursor_pointerFlat.png), default");

    this.add
      .text(width / 2, 100, "MENU", {
        fontSize: 100,
        color: "000000",
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
        text: "Create a map",
        onClick: () => {
          this.scene.manager.switch(this.scene.key, SceneKey.CreateMap);
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

      new Button(this, specifiedConfig, { x, y }, this.buttonSize);
    });
  }
}
