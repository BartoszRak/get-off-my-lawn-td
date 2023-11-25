import { Position, Size } from "../../../../../utils";
import { Label } from "../../../../shared";
import { Tower } from "../../towers/specified-towers/Tower";
import { UpgradeOptions } from "./UpgradeOptions";

export class Upgrade extends Phaser.GameObjects.Container {
  private readonly label: Label;
  private readonly options: UpgradeOptions;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    // size: Size,
    private readonly tower: Tower,
    options: Partial<UpgradeOptions> = {},
  ) {
    const { x, y } = position;
    // const { width, height } = size;
    super(scene, x, y);

    this.options = options;
    const label = new Label(scene, { x: 0, y: 0 }, "Upgrade", {
      isDisabled: !tower.canBeUpgraded(),
      onClick: () => this.handleClick(),
    });

    this.add([label]);
    scene.add.existing(this);

    this.label = label;
  }

  private handleClick() {
    console.warn("---- handle click");
    if (this.tower.canBeUpgraded()) {
      const { canBeUpgradedAgain, oldLvl, newLvl } = this.tower.upgrade();
      const { onUpgraded } = this.options;
      if (onUpgraded) {
        onUpgraded(oldLvl, newLvl);
      }
      if (!canBeUpgradedAgain) {
        this.label.disable();
      }
    }
  }
}
