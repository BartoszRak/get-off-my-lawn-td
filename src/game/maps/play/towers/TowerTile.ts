import { Position, Size } from "../../../../utils";
import { Color } from "../../../Color";
import { TowerTemplate } from "./TowerTemplate";

export class TowerTile extends Phaser.GameObjects.Group {
  private readonly wrapper: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    private readonly position: Position,
    private readonly size: Size,
    private readonly data: TowerTemplate
  ) {
    super(scene);
    this.wrapper = this.createWrapper();

    this.addMultiple([this.wrapper]);
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
    )
      .setStrokeStyle(2, Color.Success)
      .setOrigin(0);
    this.scene.add.existing(wrapper);

    return wrapper;
  }
}
