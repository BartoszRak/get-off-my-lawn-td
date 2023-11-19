import { Position, Size } from "../../../../utils";
import { EnemyAtlas } from "./EnemyAtlas";
import * as uuid from "uuid";

export interface EnemyTemplate {
  name: string;
  atlas: EnemyAtlas;
  speed: number;
  life: number;
}

export interface EnemyOptions {
  onEndReached?: (enemy: Enemy) => void;
}

export const enemyDefaultOptions: EnemyOptions = {};

export class Enemy extends Phaser.GameObjects.Container {
  private readonly sprite: Phaser.GameObjects.Sprite;
  // private readonly pathPoints: Phaser.Math.Vector2[]
  private readonly physicsGroup: Phaser.Physics.Arcade.Group;
  public readonly id = uuid.v4();

  private time = 0;
  private readonly duration: number;
  private readonly options: EnemyOptions;
  private endReached = false;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    data: EnemyTemplate,
    private readonly path: Phaser.Curves.Path,
    options: Partial<EnemyOptions> = {}
  ) {
    const { x, y } = position;
    super(scene, x, y);
    const mergedOptions = { ...enemyDefaultOptions, ...options };
    this.options = mergedOptions;

    const sprite = this.createSprite(scene, position, data.atlas);
    // console.log("--- fame names", sprite.texture.getFrameNames());
    // console.log("--- path points", path.getPoints(), path.getPoints().length);
    // this.pathPoints = path.getPoints()
    // const animation = this.scene.anims.create({
    //   key: "walk",
    //   frames: sprite.texture.getFrameNames().map((specifiedName) => ({
    //     key: data.atlas,
    //     frame: specifiedName,
    //   })),
    //   frameRate: 3,
    //   repeat: -1,
    // });
    this.sprite = sprite;
    this.add(sprite);
    this.scene.add.existing(sprite);

    this.physicsGroup = this.scene.physics.add.group(this, {
      collideWorldBounds: false,
      name: "EnemyPhysicsGroup",
    });

    const speedAsDuration = (path.getLength() / data.speed) * 100;
    this.duration = speedAsDuration;
    // console.log(
    //   `--- speed: ${
    //     data.speed
    //   } / length: ${path.getLength()} / speedAsDuration: ${speedAsDuration}`
    // );
    // this.scene.add
    //   .follower(path, x, y, EnemyAtlas.BasicZombieFront)
    //   .startFollow({
    //     duration: speedAsDuration,
    //     onUpdate: (tween) => {
    //       tween
    //     }
    //   });
  }

  update(time: number, delta: number) {
    if (this.time === -1 || this.endReached) {
      return;
    }

    this.time += delta;

    if (this.time >= this.duration) {
      const { onEndReached } = this.options;
      if (onEndReached) {
        this.endReached = true;
        onEndReached(this);
      }
      // TODO: Inform that enemy reached end
    } else {
      const delta = this.time / this.duration;

      const newPoint = this.path.getPoint(delta);
      this.sprite.setPosition(newPoint.x, newPoint.y);
    }
  }

  private createSprite(
    scene: Phaser.Scene,
    position: Position,
    atlas: EnemyAtlas
  ) {
    const { x, y } = position;
    const sprite = new Phaser.GameObjects.Sprite(scene, x, y, atlas);
    return sprite;
  }
}
