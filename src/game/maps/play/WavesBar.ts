import { flatten } from "lodash";
import { Position, Size } from "../../../utils";
import { Color } from "../../Color";
import { WaveTile } from "./WaveTile";

export class WavesBar extends Phaser.GameObjects.Rectangle {
  private readonly tiles: WaveTile[];
  // private readonly tilesGroup: Phaser.GameObjects.Group;
  private readonly tilesPhysicsGroup: Phaser.Physics.Arcade.Group;
  private currentTile: WaveTile;
  private readonly pointer: Phaser.GameObjects.Rectangle;
  private readonly pointerPhysics: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    private readonly startWave = 0,
    private readonly maxWaves = 100,
    private readonly margin = 10
  ) {
    const { x, y } = position;
    const { width, height } = size;
    super(
      scene,
      x - margin,
      y + margin,
      width + 2 * margin,
      height + 2 * margin
    );
    this.setStrokeStyle(3, Color.Contour);
    scene.add.existing(this);

    // Tiles
    this.tiles = this.createTiles(this.startWave, this.maxWaves);
    this.currentTile = this.tiles[this.startWave];

    // Pointer
    this.pointer = this.createPointer();
    this.pointerPhysics = this.scene.physics.add.existing(this.pointer);

    // Tiles mask
    const mask = this.createMask();
    this.tiles.forEach((specifiedTile) => {
      specifiedTile.setMask(mask);
    });

    // Tiles collisions
    this.tilesPhysicsGroup = scene.physics.add.group(
      flatten(
        this.tiles.map((specifiedTile) => specifiedTile.children.entries)
      ),
      { collideWorldBounds: false, name: "WaveTilesGroup" }
    );
    this.tiles.forEach((specifiedTile) => {
      this.scene.physics.add.overlap(
        this.pointerPhysics,
        specifiedTile,
        (...args) => this.onOverlap(...args)
      );
    });
  }

  start() {
    this.tilesPhysicsGroup.setVelocityX(-50);
  }

  stop() {
    this.tilesPhysicsGroup.setVelocityX(0);
  }

  private onOverlap(
    collidedPointer:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    collidedTile:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) {
    if (
      collidedPointer instanceof Phaser.Tilemaps.Tile ||
      collidedTile instanceof Phaser.Tilemaps.Tile
    ) {
      return;
    }
    const foundWave = this.findWaveByName(collidedTile.name);
    if (!foundWave) {
      return;
    }
    if (foundWave.name !== this.currentTile.name) {
      return;
    }
    this.currentTile = foundWave;
  }

  private findWaveByName(name: string) {
    return this.tiles.find(
      (specifiedTile) => specifiedTile.getReactangle().name === name
    );
  }

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

  private createTiles(start: number, max: number) {
    const shift = start * this.width;
    return new Array(max).fill(null).map((_, index) => {
      const name = `Wave no. ${index + 1}`;
      return new WaveTile(
        this.scene,
        { x: this.x + index * this.width - shift, y: this.y },
        { width: this.width, height: this.height },
        name,
        index
      );
    });
  }

  private createPointer() {
    const width = 2;
    const height = this.height / 2;

    const rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x,
      this.y,
      width,
      height,
      Color.Error
    ).setName("WaveBarPointer");
    this.scene.add.existing(rectangle);
    return rectangle;
  }
}
