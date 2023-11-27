import { flatten } from "lodash";
import {
  Position,
  Size,
  isDefined,
  numberToColorHsl,
  rgbIntToHex,
} from "../../../utils";
import { Color } from "../../Color";
import { WaveTile } from "./WaveTile";

export interface WavesBarCallbacks {
  onWaveChanged: (wave: WaveTile) => void;
}

export class WavesBar extends Phaser.GameObjects.Rectangle {
  private tiles: WaveTile[];
  // private readonly tilesGroup: Phaser.GameObjects.Group;
  private readonly tilesMask: Phaser.Display.Masks.GeometryMask;

  private readonly tilesPhysicsGroup: Phaser.Physics.Arcade.Group;
  private readonly pointerPhysics: Phaser.GameObjects.Rectangle;

  private currentTile: WaveTile;
  private readonly pointer: Phaser.GameObjects.Rectangle;

  private readonly tilesPerBatch = 10;
  private tilesMargin = 1;
  private readonly tileSpeed = 15;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    private readonly startWave = 0,
    private readonly maxWaves = 10,
    margin = 10,
    private readonly callbacks: Partial<WavesBarCallbacks> = {}
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

    // 1. Pointer
    this.pointer = this.createPointer();
    this.pointerPhysics = this.scene.physics.add.existing(this.pointer);

    // 2. Tiles mask & physics
    this.tilesMask = this.createMask();
    this.tilesPhysicsGroup = this.scene.physics.add.group([], {
      collideWorldBounds: false,
      name: "WaveTilesGroup",
    });

    // 3. Tiles
    this.tiles = this.createTiles(3, this.startWave, -this.startWave);
    this.currentTile = this.tiles[0];

    this.pointer.setDepth(10);
  }

  private setCurrentWave(wave: WaveTile) {
    this.currentTile = wave;
    const { onWaveChanged } = this.callbacks;
    if (onWaveChanged) {
      onWaveChanged(wave);
    }
  }

  start() {
    this.tilesPhysicsGroup.setVelocityX(-this.tileSpeed);
    const { onWaveChanged } = this.callbacks;
    if (onWaveChanged) {
      onWaveChanged(this.currentTile);
    }
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
    if (foundWave.name === this.currentTile.name) {
      return;
    }
    // Explanatnion: This had ot be check due to stupid way to detect new wave - we should use some timers instead of collisions...
    if (foundWave.index <= this.currentTile.index) {
      return;
    }
    this.setCurrentWave(foundWave);
    this.ensureTiles();
  }

  private ensureTiles() {
    const minIndex = this.currentTile.getDetails().index - this.tilesMargin;
    const outdatedTiles = this.tiles.filter(
      (specifiedTile, index) => specifiedTile.getDetails().index < minIndex
    );
    if (outdatedTiles.length) {
      outdatedTiles.forEach((specifiedOutdatedTile) => {
        specifiedOutdatedTile.destroyCollider();
        specifiedOutdatedTile.destroy(true, true);
      });
      const outdatedIndexes = outdatedTiles.map(
        (specifiedOutdatedTile) => specifiedOutdatedTile.getDetails().index
      );
      this.tiles = this.tiles.filter(
        (specifiedTile) =>
          !outdatedIndexes.includes(specifiedTile.getDetails().index)
      );
    }
    const additionalTiles = this.tiles.filter(
      (specifiedTile, index) =>
        specifiedTile.getDetails().index > this.currentTile.getDetails().index
    );
    const missingTilesCount = this.tilesMargin - additionalTiles.length;
    if (missingTilesCount > 0) {
      console.log("--- tiles missing: ", missingTilesCount);
      const lastTile =
        additionalTiles[additionalTiles.length - 1] || this.currentTile;
      const newTilesStartingIndex = lastTile.getDetails().index + 1;
      const newTiles = this.createTiles(
        missingTilesCount,
        newTilesStartingIndex,
        -this.currentTile.getDetails().index,
        lastTile.getWrapper().x + lastTile.getWrapper().width
      );
      this.tiles = [...this.tiles, ...newTiles];
      this.start();
    }
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

  private createTiles(
    count: number,
    startIndex: number,
    positionShiftIndex = 0,
    x?: number
  ) {
    const createdTiles = new Array(count).fill(null).map((_, index) => {
      const adjustedIndex = index + startIndex;
      const positionIndex = adjustedIndex + positionShiftIndex;
      const name = `Wave no. ${adjustedIndex + 1}`;
      const initialX = this.x + positionIndex * this.width;
      const preparedX = isDefined(x) ? x : initialX;
      const wave = new WaveTile(
        this.scene,
        { x: preparedX, y: this.y },
        { width: this.width, height: this.height },
        name,
        adjustedIndex,
        parseInt(rgbIntToHex(numberToColorHsl(adjustedIndex)), 16)
      );
      this.applyPhysicsAndMask(wave);

      return wave;
    });
    console.info(
      `# Created tiles: [${createdTiles
        .map((specifiedTile) => specifiedTile.getDetails().name)
        .join(", ")}]`
    );
    return createdTiles;
  }

  private applyPhysicsAndMask(wave: WaveTile) {
    // Mask
    wave.setMask(this.tilesMask);
    // Collisions
    this.tilesPhysicsGroup.addMultiple(wave.children.entries);

    const collider = this.scene.physics.add.overlap(
      this.pointerPhysics,
      wave,
      (...args) => this.onOverlap(...args)
    );
    wave.attachCollider(collider);
  }

  private createPointer() {
    const width = 2;
    const height = this.height / 4;

    const rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x,
      this.y - height,
      width,
      height,
      Color.Contour
    )
      .setName("WaveBarPointer")
      .setOrigin(0.5, 1);
    this.scene.add.existing(rectangle);
    return rectangle;
  }
}
