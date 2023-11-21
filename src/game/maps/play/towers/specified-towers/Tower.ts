import { Position, Size, isDefined, isKeyDefined } from "../../../../../utils";
import { Color } from "../../../../Color";
import { Image } from "../../../../Image";
import { Sound } from "../../../../Sound";
import { TowerImage } from "../../../../TowerImage";
import { Enemy } from "../../enemies/Enemy";
import { EnemyWithDistance } from "../../enemies/EnemyWithDistance";
import { TowerTemplate } from "../TowerTemplate";
import { TowerBullet } from "./TowerBullet";

export interface TowerOptions {
  showOutline: boolean;
  displayRange?: boolean;
}

const defaultOptions: TowerOptions = {
  showOutline: true,
};

export class Tower extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly base: Phaser.GameObjects.Image;
  private readonly barrel: Phaser.GameObjects.Image;
  private readonly range?: Phaser.GameObjects.Arc;
  private laser?: Phaser.GameObjects.Graphics;
  private readonly options: TowerOptions;
  private readonly baseChildrens: (
    | Phaser.GameObjects.Rectangle
    | Phaser.GameObjects.Image
  )[];
  private lockedOn?: EnemyWithDistance;
  private shootingTimerEvent?: Phaser.Time.TimerEvent;
  private readonly bulletsGroup: Phaser.GameObjects.Group;
  private readonly shootSound: Phaser.Sound.BaseSound;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    private readonly data: TowerTemplate,
    options: Partial<TowerOptions> = defaultOptions,
    private level = 0
  ) {
    super(scene);
    const mergedOptions = { ...options, ...defaultOptions };
    this.options = mergedOptions;

    this.wrapper = this.createWrapper();
    this.base = this.createImage(data.levels[level].images.base, this.size);
    this.barrel = this.createImage(data.levels[level].images.barrel, this.size);
    if (mergedOptions.displayRange) {
      this.range = this.createRange(scene, position, data.levels[level].range);
    }

    this.baseChildrens = [this.wrapper, this.base, this.barrel];
    this.addMultiple([...this.baseChildrens, this.range].filter(isDefined));
    this.bulletsGroup = new Phaser.GameObjects.Group(this.scene);
    this.shootSound = this.scene.sound.add(data.shotSound);
  }

  stop() {
    (this.bulletsGroup.getChildren() as TowerBullet[]).forEach(
      (specifiedBullet) => specifiedBullet.stop()
    );
  }

  getMaxLevel() {
    return this.data.levels.length - 1;
  }

  setAlpha(value: number, step?: number | undefined): this {
    this.baseChildrens.forEach((specifiedChild, index) => {
      const newAlpha = step ? value + index * step : value;
      specifiedChild.setAlpha(newAlpha);
    });
    return this;
  }

  update(availableEnemies: Enemy[]) {
    const newTargetToLockOn = this.findNewTargetToLock(availableEnemies);
    if (newTargetToLockOn) {
      this.lockOn(newTargetToLockOn);
    }
    if (this.lockedOn) {
      const isInRange = this.isEnemyInRange(this.lockedOn.enemy).isInRange;
      if (isInRange && this.lockedOn.enemy.active) {
        this.updateRotation(this.lockedOn);
        this.updateLaser(this.lockedOn);
      } else {
        this.removeLock();
      }
    }
    this.updateAllBullets();
  }

  private updateAllBullets() {
    (this.bulletsGroup.getChildren() as TowerBullet[]).forEach(
      (specifiedBullet) => specifiedBullet.update()
    );
  }

  private removeLock() {
    this.destroyShootingTimerEventEventually();
    this.lockedOn = undefined;
  }

  private lockOn(enemyWithDistance: EnemyWithDistance) {
    this.lockedOn = enemyWithDistance;
    const { rateOfFire } = this.getCurrentData();
    const shootsIntervalInMs = 1000 / rateOfFire;
    console.info(
      `# Lock on (rate of fire: ${rateOfFire}, interval in ms: ${shootsIntervalInMs})`
    );
    this.destroyShootingTimerEventEventually();
    this.shootBullet(enemyWithDistance);
    this.shootingTimerEvent = this.scene.time.addEvent({
      delay: shootsIntervalInMs,
      loop: true,
      callback: () => this.shootBullet(enemyWithDistance),
    });
  }

  private destroyShootingTimerEventEventually() {
    if (this.shootingTimerEvent) {
      this.shootingTimerEvent.paused = true;
      this.shootingTimerEvent.remove();
      this.shootingTimerEvent = undefined;
    }
  }

  private shootBullet(enemyWithDistance: EnemyWithDistance) {
    console.info("# Bullet shot");
    this.shootSound.play();
    const { images, damage } = this.getCurrentData();
    const bullet = new TowerBullet(
      this.scene,
      this.position,
      this.size,
      enemyWithDistance.enemy,
      {
        image: images.bullet,
        damage,
      }
    );
    this.bulletsGroup.add(bullet);
  }

  private updateLaser(lockedEnemy: EnemyWithDistance) {
    if (this.laser) {
      this.laser?.destroy(true);
      this.laser = undefined;
    }
    const center = this.getCenterPoint();
    const enemyCenter = lockedEnemy.enemy.getCenterPoint();

    const path = new Phaser.Curves.Path(center.x, center.y);
    path.lineTo(enemyCenter.x, enemyCenter.y);

    const graphics = this.scene.add.graphics({
      lineStyle: {
        width: 1,
        color: Color.Error,
        alpha: 0.5,
      },
    });
    path.draw(graphics);
    this.scene.add.existing(graphics);

    this.laser = graphics;
    this.add(graphics);
  }

  private updateRotation(lockedEnemy: EnemyWithDistance) {
    const { enemy, distance } = lockedEnemy;
    enemy.setAlpha(0.3);
    const angle = Phaser.Math.Angle.BetweenPoints(
      enemy.getCenterPoint(),
      this.getCenterPoint()
    );
    // Explanation: Not really sure why do we need subtraction here because angle is shifted?
    const degrees = Phaser.Math.RadToDeg(angle) - 90;
    this.barrel.setAngle(degrees);
  }

  private findNewTargetToLock(enemies: Enemy[]): EnemyWithDistance | undefined {
    const targetToLockOn = this.findClosestEnemyInRange(enemies);
    if (!targetToLockOn) {
      return;
    }
    if (!this.lockedOn) {
      return targetToLockOn;
    }
    const isAlreadyLocked = this.lockedOn.enemy.id === targetToLockOn.enemy.id;
    const preparedTarget = isAlreadyLocked ? undefined : targetToLockOn;
    return preparedTarget;
  }

  private findClosestEnemyInRange(enemies: Enemy[]) {
    const enemyAndDistance = enemies.reduce<{
      enemy?: Enemy;
      distance: number;
    }>(
      (closest, specifiedEnemy) => {
        const { isInRange, distance } = this.isEnemyInRange(specifiedEnemy);
        if (distance < closest.distance && isInRange) {
          return {
            distance,
            enemy: specifiedEnemy,
          };
        }
        return closest;
      },
      {
        enemy: undefined,
        distance: Number.MAX_VALUE,
      }
    );
    return isKeyDefined(enemyAndDistance, "enemy")
      ? enemyAndDistance
      : undefined;
  }

  private isEnemyInRange(enemy: Enemy) {
    const distance = Phaser.Math.Distance.BetweenPoints(
      this.getCenterPoint(),
      enemy.getCenterPoint()
    );
    const isInRange = distance <= this.getCurrentData().range;
    return {
      isInRange,
      distance,
    };
  }

  private getCurrentData() {
    return this.data.levels[this.level];
  }

  private getCenterPoint() {
    const vector = new Phaser.Math.Vector2();
    return this.wrapper.getCenter(vector);
  }

  private createImage(imageSource: TowerImage, size: Size) {
    const { x, y } = this.position;
    const { width, height } = size;
    const image = new Phaser.GameObjects.Image(
      this.scene,
      x,
      y,
      imageSource
    ).setDisplaySize(width, height);
    this.scene.add.existing(image);

    return image;
  }

  private createWrapper() {
    const { x, y } = this.position;
    const { width, height } = this.size;
    const wrapper = new Phaser.GameObjects.Rectangle(
      this.scene,
      x,
      y,
      width,
      height
    ).setStrokeStyle(2, Color.Contour);
    this.scene.add.existing(wrapper);

    return wrapper;
  }

  private createRange(scene: Phaser.Scene, position: Position, range: number) {
    const { x, y } = position;
    const arc = new Phaser.GameObjects.Arc(scene, x, y, range)
      .setFillStyle(Color.Error)
      .setAlpha(0.15);
    this.scene.add.existing(arc);
    return arc;
  }
}
