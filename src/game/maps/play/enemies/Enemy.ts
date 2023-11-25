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

export interface EnemyOptions {}

export const enemyDefaultOptions: EnemyOptions = {};

export class Enemy extends Phaser.GameObjects.Container {
  private readonly sprite: Phaser.GameObjects.Sprite;
  private readonly lifeBar: LifeBar;
  public readonly id = uuid.v4();

  private time = 0;
  private readonly duration: number;
  private readonly options: EnemyOptions;

  private currentLife: number;
  public readonly maxLife: number;
  private readonly lifeBarHeight = 7;
  public readonly speed: number
  public  pathDelta: number = 0

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    data: EnemyTemplate,
    private readonly path: Phaser.Curves.Path,
    options: Partial<EnemyOptions> = {}
  ) {
    super(scene, position.x, position.y);

    this.currentLife = data.life;
    this.maxLife = data.life;
    this.speed = data.speed
    const mergedOptions = { ...enemyDefaultOptions, ...options };
    this.options = mergedOptions;

    const sprite = this.createSprite(scene, { x: 0, y: 0 }, data.atlas);
    const lifeBar = new LifeBar(
      scene,
      {
        x: 0,
        y: 0 - size.height / 1.5,
      },
      {
        width: size.width * 0.8,
        height: this.lifeBarHeight,
      },
      this.currentLife / this.maxLife
    );
    const frames = sprite.texture
      .getFrameNames()
      .sort()
      .map((specifiedName) => ({
        key: data.atlas,
        frame: specifiedName,
      }));
    const animationKey = `${Enemy.name}_walk`;
    const animation =
      this.scene.anims.get(animationKey) ||
      this.scene.anims.create({
        key: animationKey,
        frames,
        frameRate: 9,
        repeat: -1,
        yoyo: true,
      });
    sprite.play(animation.key);
    this.sprite = sprite;
    this.lifeBar = lifeBar;
    this.add([sprite, lifeBar]);

    const speedAsDuration = (path.getLength() / data.speed) * 100;
    this.duration = speedAsDuration;
    this.scene.add.existing(this);
  }

  applyDamage(damage: number) {
    const newLife = Math.max(...[this.currentLife - damage, 0]);
    const isDead = newLife === 0;
    this.currentLife = newLife;
    this.lifeBar.setLife(this.currentLife / this.maxLife);
    if (isDead) {
      console.warn(`# Enemy dead! (id: ${this.id})`);
      this.destroy(true);
    }
  }

  getCenterPoint() {
    return new Phaser.Math.Vector2(this.x, this.y);
  }

  update(time: number, delta: number) {
    if (this.time === -1) {
      return;
    }
    this.time += delta;
    if (this.time >= this.duration) {
      this.destroy(true);
    } else {
      const delta = this.time / this.duration;
      this.pathDelta = delta
      const newPoint = this.path.getPoint(delta);
      this.setPosition(newPoint.x, newPoint.y);
    }
  }

  private createSprite(
    scene: Phaser.Scene,
    position: Position,
    atlas: EnemyAtlas
  ) {
    const { x, y } = position;
    const sprite = new Phaser.GameObjects.Sprite(scene, x, y, atlas);
    this.scene.add.existing(sprite);
    return sprite;
  }
}
