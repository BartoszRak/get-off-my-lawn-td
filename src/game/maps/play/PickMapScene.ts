import Phaser from "phaser";
import { SceneKey } from "../../SceneKey";
import { RawMap, RawMaps } from "../RawMaps";
import { ExportedGrid } from "../builder/ExportedGrid";
import { Position, Size } from "../../../utils";
import { GameMap } from "./game-map/GameMap";
import { Image, Images } from "../../Image";
import { Label } from "../../shared";

export class PickMapScene extends Phaser.Scene {
  private readonly planeWidthPercentage = 0.6;
  private readonly margin = 20;

  constructor() {
    super({
      key: SceneKey.PickMap,
    });
  }

  preload() {
    // this.load.json(...RawMaps[RawMap.Maya]);
    // this.load.json(...RawMaps[RawMap.Spiral]);
    // this.load.json(...RawMaps[RawMap.Random]);
    this.load.json(...RawMaps[RawMap.Weirdo]);

    this.load.image(...Images[Image.PointerFlat]);
    this.load.image(...Images[Image.CursorHand]);
  }

  create() {
    this.input.setDefaultCursor("url(assets/cursor_pointerFlat.png), default");

    this.createMultiplePreviews();
    this.createButtons();
  }

  private createMultiplePreviews() {
    const { width, height } = this.scale;
    const planeWidth = width * this.planeWidthPercentage;
    const planeHeight = height * this.planeWidthPercentage;
    const wrapper = this.add
      .rectangle(
        width / 2,
        height / 2,
        width * this.planeWidthPercentage,
        height * this.planeWidthPercentage,
      )
      .setOrigin(0.5)
      .setStrokeStyle(1, parseInt("000000", 16));

    const parsedMaps: ExportedGrid[] = [
      // this.cache.json.get(RawMap.Maya),
      // this.cache.json.get(RawMap.Spiral),
      // this.cache.json.get(RawMap.Random),
      this.cache.json.get(RawMap.Weirdo),
    ];
    parsedMaps.forEach((specifiedParsedMap, index) => {
      this.createPreview(specifiedParsedMap, wrapper, index);
    });
  }

  private createPreview(
    grid: ExportedGrid,
    wrapper: Phaser.GameObjects.Rectangle,
    index: number,
  ) {
    const columnIndex = index % 3;
    const rowIndex = Math.floor(index / 3);
    const size: Size = {
      width: wrapper.width / 3,
      height: wrapper.height / 3,
    };
    const sizeWithoutMargins: Size = {
      width: size.width - this.margin * 2,
      height: size.height - this.margin * 2,
    };
    const position: Position = {
      x:
        wrapper.x -
        wrapper.width / 2 +
        columnIndex * size.width +
        size.width / 2,
      y:
        wrapper.y -
        wrapper.height / 2 +
        rowIndex * size.height +
        size.height / 2,
    };

    const map = new GameMap(this, position, sizeWithoutMargins, grid, {
      isButton: true,
      onClick: (map) => this.launchGame(grid),
    });
    this.add.existing(map);
  }

  private createButtons() {
    new Label(this, { x: 100, y: 50 }, "BACK", {
      onClick: () => this.goBackToMenu(),
      fontSize: 25,
      padding: {
        x: 15,
        y: 15,
      },
    });
  }

  private goBackToMenu() {
    this.scene.manager.switch(this.scene.key, SceneKey.MainMenu);
  }

  private launchGame(grid: ExportedGrid) {
    this.scene.stop();
    this.scene.manager.start(SceneKey.Game, { grid });
  }
}
