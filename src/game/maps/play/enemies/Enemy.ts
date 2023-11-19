import { Position, Size } from "../../../../utils";
import { EnemyAtlas } from "./EnemyAtlas";
import * as uuid from "uuid";
import { LifeBar } from "./LifeBar";

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

export class Enemy extends Phaser.GameObjects.Group {
  private readonly sprite: Phaser.GameObjects.Sprite;
  private readonly lifeBar: LifeBar;
  // private readonly pathPoints: Phaser.Math.Vector2[]
  public readonly id = uuid.v4();

  private time = 0;
  private readonly duration: number;
  private readonly options: EnemyOptions;
  private endReached = false;

  private readonly currentLife: number;
  private readonly maxLife: number;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    private readonly size: Size,
    data: EnemyTemplate,
    private readonly path: Phaser.Curves.Path,
    options: Partial<EnemyOptions> = {}
  ) {
    super(scene);
    this.currentLife = data.life / 2;
    this.maxLife = data.life;
    const mergedOptions = { ...enemyDefaultOptions, ...options };
    this.options = mergedOptions;

    const sprite = this.createSprite(scene, position, data.atlas);
    const lifeBarHeight = 7;
    const lifeBar = new LifeBar(
      scene,
      {
        x: position.x,
        y: position.y - size.height / 1.5,
      },
      {
        width: size.width * 0.8,
        height: lifeBarHeight,
      },
      this.currentLife / this.maxLife
    );
    setTimeout(() => {
      lifeBar.setLife(0.2);
    }, 1000);
    // console.log("--- fame names", sprite.texture.getFrameNames());
    // console.log("--- path points", path.getPoints(), path.getPoints().length);
    // this.pathPoints = path.getPoints()
    const frames = sprite.texture
      .getFrameNames()
      .sort()
      .map((specifiedName) => ({
        key: data.atlas,
        frame: specifiedName,
      }));
    console.log("### frames", frames);
    const animation = this.scene.anims.create({
      key: "walk",
      frames,
      frameRate: 9,
      repeat: -1,
      yoyo: true,
    });
    if (animation !== false) {
      console.info(`# Play enemy animation "${animation.key}"`);
      sprite.play(animation.key);
    }
    this.sprite = sprite;
    this.lifeBar = lifeBar;
    this.addMultiple([sprite, ...lifeBar.children.entries]);
    this.children.entries.forEach((specifiedChildren) =>
      this.scene.add.existing(specifiedChildren)
    );

    const speedAsDuration = (path.getLength() / data.speed) * 100;
    this.duration = speedAsDuration;
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
      this.lifeBar.setPosition(newPoint.x, newPoint.y - this.size.height / 1.5);
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
