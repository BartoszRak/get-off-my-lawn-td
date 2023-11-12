import { Position, Size } from "../../../utils";
import { Color } from "../../Color";
import { Heart } from "./Heart";

export class HeartsBar extends Phaser.GameObjects.Rectangle {
  private readonly hearts: Heart[];
  private currentLives: number = 10;
  private readonly margin: number;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Omit<Size, "height">,
    private readonly maxLives = 10
  ) {
    const { x, y } = position;
    const { width } = size;
    const heartSize = width / maxLives;
    const margin = 10;
    super(
      scene,
      x - margin,
      y + margin,
      width + 2 * margin,
      heartSize + 2 * margin
    );
    this.setStrokeStyle(3, Color.Error);
    this.margin = margin;

    this.currentLives = maxLives;
    this.hearts = this.createHearts(heartSize);

    scene.add.existing(this)
  }

  setLives(count: number) {
    if (this.isLiveCountValid(count)) {
      this.currentLives = count;
    } else {
      const validCount = this.createValidLiveCountAndLog(
        this.currentLives,
        count
      );
      this.currentLives = validCount;
    }
    this.refreshHearts();
  }

  decreaseLives(count: number) {
    const newLives = this.currentLives - count;
    if (this.isLiveCountValid(newLives)) {
      this.currentLives = newLives;
    } else {
      this.currentLives = this.createValidLiveCountAndLog(
        this.currentLives,
        newLives
      );
    }
    this.refreshHearts();
  }

  increaseLives(count: number) {
    const newLives = this.currentLives + count;
    if (this.isLiveCountValid(newLives)) {
      this.currentLives = newLives;
    } else {
      this.currentLives = this.createValidLiveCountAndLog(
        this.currentLives,
        newLives
      );
    }
    this.refreshHearts();
  }

  private isLiveCountValid(count: number) {
    return count >= 0 && count <= this.maxLives;
  }

  private createValidLiveCountAndLog(
    currentCount: number,
    invalidCount: number
  ) {
    const validCount = this.createValidLiveCount(currentCount, invalidCount);
    const message = `Setting lives to ${validCount} instead of ${invalidCount} which is invalid lives count.`;
    const error = new Error(message);
    console.warn(error);

    return validCount;
  }

  private createValidLiveCount(currentCount: number, invalidCount: number) {
    if (invalidCount > currentCount) {
      return this.maxLives;
    }
    if (invalidCount < currentCount) {
      return 0;
    }
    return currentCount;
  }

  private refreshHearts() {
    this.hearts.forEach((specifiedHeart, index) => {
      this.actOnHeart(specifiedHeart, index);
    });
  }

  private createHearts(heartSize: number) {
    const hearts = new Array(this.maxLives).fill(null).map((_, index) => {
      const x = this.x + (index + 1) * heartSize - this.width / 2;
      return new Heart(
        this.scene,
        { x, y: this.y - this.margin },
        heartSize,
        index < this.currentLives
      );
    });
    return hearts;
  }

  private actOnHeart(heart: Heart, index: number) {
    index >= this.currentLives ? heart.unfill() : heart.fillUp();
  }
}
