import GlossPanel from "../assets/glassPanel.png";
import CursorHand from "../assets/cursor_hand.png";
import CursorPointerFlat from "../assets/cursor_pointerFlat.png";
import { SceneKey } from "./SceneKey";

enum MainMenuImage {
  GlossPanel = "gloss-panel",
  DefaultCursor = "DefaultCursor",
  PointerCursor = "PointerCursor",
}

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: SceneKey.MainMenu,
    });
  }

  preload() {
    this.load.image(MainMenuImage.GlossPanel, GlossPanel);
    this.load.image(MainMenuImage.DefaultCursor, CursorPointerFlat);
    this.load.image(MainMenuImage.PointerCursor, CursorHand);
  }

  create() {}
}
