import { Position, Size } from "../../../../../utils";
import { TowerImage } from "../../../../TowerImage";
import { Enemy } from "../../enemies/Enemy";

export interface TowerBulletOptions {
  speed: number;
  image: TowerImage;
  hitMargin: number;
  damage: number;
}

const towerBulletDefaultOptions: TowerBulletOptions = {
  speed: 100,
  image: TowerImage.MachineGunBullet,
  hitMargin: 10,
  damage: 0,
};

export class TowerBullet extends Phaser.GameObjects.Image {
  private readonly physicsGroup: Phaser.Physics.Arcade.Group;
  private readonly options: TowerBulletOptions;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    private readonly target: Enemy,
    options: Partial<TowerBulletOptions> = {},
  ) {
    const mergedOptions = { ...towerBulletDefaultOptions, ...options };
    const { x, y } = position;
    const { width, height } = size;
    super(scene, x, y, mergedOptions.image);
    this.setDisplaySize(width, height);

    this.options = mergedOptions;
    this.scene.add.existing(this);
    this.physicsGroup = new Phaser.Physics.Arcade.Group(
      this.scene.physics.world,
      this.scene,
      this,
    );
  }

  update() {
    this.updateVelocity();
  }

  stop() {
    this.physicsGroup.setVelocity(0, 0);
  }

  private updateVelocity() {
    // Calculate the angle between the bullet and the target
    const distance = Phaser.Math.Distance.BetweenPoints(
      this.getCenter(),
      this.target.getCenterPoint(),
    );
    const isTargetReached = distance < this.options.hitMargin;
    if (isTargetReached) {
      // Explanation: Apply damage only if target isn't destroyed.
      if (this.target.active) {
        this.target.applyDamage(this.options.damage);
      }
      return this.destroy();
    }
    const angle = Phaser.Math.Angle.BetweenPoints(
      this.getCenter(),
      this.target.getCenterPoint(),
    );
    const degrees = Phaser.Math.RadToDeg(angle) - 90;

    this.setAngle(degrees);
    // Set the velocity based on the angle
    const vx = Math.cos(angle) * this.options.speed;
    const vy = Math.sin(angle) * this.options.speed;
    this.physicsGroup.setVelocity(vx, vy);
  }
}
