import { Position, Size } from "../../../utils";

export class WaveTile extends Phaser.GameObjects.Rectangle {
  private readonly text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    { x, y }: Position,
    { width, height }: Size,
    name: string
  ) {
    super(scene, x, y, width, height);

    this.text = new Phaser.GameObjects.Text(scene, x, y, name, {});
    this.scene.add.existing(this.text);
  }
}
