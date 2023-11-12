import { flatten } from "lodash";
import { Position, Size } from "../../../utils";
import { Color } from "../../Color";
import { WaveTile } from "./WaveTile";

export class WavesBar extends Phaser.GameObjects.Rectangle {
  private readonly tiles: WaveTile[];
  // private readonly tilesGroup: Phaser.GameObjects.Group;
  private readonly tilesPhysicsGroup: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    private readonly maxWavesDisplay = 2,
    private readonly margin = 10,
    private readonly wave = 0,
    private readonly waveTimeInMs = 20000
  ) {
    const { x, y } = position;
    const { width, height } = size;
    console.log(`# WaveBar - x: ${x - margin} y: ${y + margin} `);
    super(
      scene,
      x - margin,
      y + margin,
      width + 2 * margin,
      height + 2 * margin
    );
    console.log(`# This - x: ${this.x} y: ${this.y} `);

    this.setStrokeStyle(3, Color.Contour);

    this.createPointer();

    this.tiles = this.createTiles(50);
    const mask = this.createMask();
    this.tiles.forEach((specifiedTile) => {
      specifiedTile.setMask(mask);
    });
    this.tilesPhysicsGroup = scene.physics.add.group(
      flatten(
        this.tiles.map((specifiedTile) => specifiedTile.children.entries)
      ),
      { collideWorldBounds: false }
    );
    this.tilesPhysicsGroup.setVelocityX(-15);

    scene.add.existing(this);
  }

  start() {}

  stop() {}

  update() {}

  private createMask() {
    return new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x,
      this.y,
      this.width,
      this.height,
      Color.Contour
    ).createGeometryMask();
  }

  private createTiles(max: number) {
    return new Array(max).fill(null).map((_, index) => {
      const name = `Wave no. ${index + 1}`;
      return new WaveTile(
        this.scene,
        { x: this.x + (index + 1) * this.width - this.width, y: this.y },
        { width: this.width, height: this.height },
        name
      );
    });
  }

  private createPointer() {
    const startPoint: Position = {
      x: this.x,
      y: this.y - this.height / 2,
    };
    const endPoint: Position = {
      x: this.x,
      y: this.y,
    };
    const path = new Phaser.Curves.Path(startPoint.x, startPoint.y);
    path.lineTo(endPoint.x, endPoint.y);

    const graphics = this.scene.add.graphics({
      lineStyle: {
        width: 3,
        color: Color.Contour,
      },
    });
    path.draw(graphics);
  }
}
