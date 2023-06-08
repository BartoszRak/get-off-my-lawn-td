import { Position, Size } from "../../../utils";
import { Color } from "../../Color";
import { Image, Images } from "../../Images";

export class HeartsBar extends Phaser.GameObjects.Rectangle {
  private readonly hearts: Phaser.GameObjects.Image[];
  private currentLives: number;
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
  }

  setLives(newLives: number) {
    this.currentLives = newLives;
  }

  private createHearts(heartSize: number) {
    const hearts = new Array(this.maxLives).fill(null).map((_, index) => {
      const x =
        this.x +
        index * heartSize -
        this.width / 2 +
        heartSize / 2 +
        this.margin;
      return this.scene.add
        .image(x, this.y, Image.PaperHeart)
        .setDisplaySize(heartSize, heartSize);
    });
    return hearts;
  }
}
