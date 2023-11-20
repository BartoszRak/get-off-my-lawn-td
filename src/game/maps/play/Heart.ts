import { Position, Size } from "../../../utils";
import { Image } from "../../Image";

export class Heart extends Phaser.GameObjects.Image {
  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: number,
    private filledUp = false
  ) {
    const { x, y } = position;
    const width = size,
      height = size;
    console.log(`# HEART - x: ${x} y: ${y} width: ${width} height: ${height}`)
    const margin = 10;
    super(
      scene,
      x - margin,
      y + margin,
      filledUp ? Image.PaperHeartFull : Image.PaperHeart
    );
    this.setDisplaySize(width, height);
    scene.add.existing(this)
  }

  fillUp() {
    this.filledUp = true;
    this.setTexture(Image.PaperHeartFull);
  }

  unfill() {
    this.filledUp = false;
    this.setTexture(Image.PaperHeart);
  }
}
