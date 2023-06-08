import { Image, Images } from "../../Images";
import { SceneKey } from "../../SceneKey";
import { Button } from "../../menu/Button";
import { BuilderGrid } from "./BuilderGrid";
import { saveAs } from "file-saver";
import { ExportedGrid } from "./ExportedGrid";
import { BuilderGridEvent } from "./BuilderGridEvent";
import { isDefined } from "../../../utils";

export class BuilderScene extends Phaser.Scene {
  private readonly planeWidthPercentage = 0.4;
  private gridToExport?: ExportedGrid;

  constructor() {
    super({
      key: SceneKey.CreateMap,
    });
  }

  preload() {
    this.load.image(...Images[Image.GlassPanel]);
  }

  create() {
    this.input.setDefaultCursor("url(assets/cursor_pointerFlat.png), default");
    const { width, height } = this.scale;
    const planeWidth = width * this.planeWidthPercentage;
    const grid = new BuilderGrid(
      this,
      { x: width / 2, y: height / 2 },
      { width: planeWidth, height: planeWidth },
      {
        columns: 24,
        rows: 24,
      }
    );
    const { exportButton } = this.createButtons(grid);
    grid.on(
      BuilderGridEvent.ExportAvailable,
      (newGridToExport: ExportedGrid) => {
        this.gridToExport = newGridToExport;
        exportButton.enable();
      }
    );
    grid.on(BuilderGridEvent.ExportUnavailable, () => {
      exportButton.disable();
      this.gridToExport = undefined;
    });
  }

  private createButtons(grid: BuilderGrid) {
    const { width, height } = this.scale;
    const backButton = new Button(
      this,
      {
        text: "BACK",
        onClick: () => this.goBackToMenu(),
      },
      { x: 100, y: 50 },
      undefined
    );
    const resetButton = new Button(
      this,
      {
        text: "RESET",
        onClick: () => grid.deselectAllCells(),
      },
      {
        x: width - 100, // - ButtonDefaultSize.width,
        y: height - 50, // - ButtonDefaultSize.height,
      },
      undefined
    );
    const exportButton = new Button(
      this,
      {
        text: "EXPORT",
        onClick: () => {
          this.executeExport(grid);
        },
        disabled: true,
      },
      {
        x: width - 100, // - ButtonDefaultSize.width,
        y: height - 120, // - ButtonDefaultSize.height,
      },
      undefined
    );

    return {
      backButton,
      resetButton,
      exportButton,
    };
  }

  private executeExport(grid: BuilderGrid) {
    if (!isDefined(this.gridToExport)) {
      return;
    }
    console.log("--- export");
    const stringifiedExportedGrid = JSON.stringify(this.gridToExport);
    console.warn("EXPORTED GRID:", stringifiedExportedGrid);
    const blob = new Blob([stringifiedExportedGrid], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "exported-map");
    grid.deselectAllCells();
  }

  private goBackToMenu() {
    this.scene.manager.switch(this.scene.key, SceneKey.MainMenu);
  }
}
