import { Position, Size } from "../../../../../utils";
import { Label } from "../../../../shared";
import { Tower } from "../../towers/specified-towers/Tower";
import { UpgradeOptions, defaultUpgradeOptions } from "./UpgradeOptions";

export class Upgrade extends Phaser.GameObjects.Container {
  private readonly label: Label;
  private readonly options: UpgradeOptions;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    // size: Size,
    private readonly tower: Tower,
    options: Partial<UpgradeOptions> = {}
  ) {
    const { x, y } = position;
    // const { width, height } = size;
    super(scene, x, y);
    const fullOptions = { ...defaultUpgradeOptions, ...options };
    this.options = fullOptions;
    const shouldBeEnable =
      tower.canBeUpgraded() && fullOptions.balance >= tower.getUpgradeCost();
    const label = new Label(scene, { x: 0, y: 0 }, "Upgrade", {
      isDisabled: !shouldBeEnable,
      onClick: () => this.handleClick(),
    });

    this.add([label]);
    scene.add.existing(this);

    this.label = label;
  }

  updateBalance(balance: number) {
    this.options.balance = balance;
    if (this.tower.canBeUpgraded()) {
      const upgradeCost = this.tower.getUpgradeCost();
      if (balance >= upgradeCost) {
        this.label.enable();
      } else {
        this.label.disable();
      }
    }
  }

  private handleClick() {
    console.warn("---- handle click");
    if (this.tower.canBeUpgraded()) {
      const upgradeCost = this.tower.getUpgradeCost();
      const { canBeUpgradedAgain, oldLvl, newLvl } = this.tower.upgrade();
      const { onUpgraded } = this.options;
      if (onUpgraded) {
        onUpgraded(oldLvl, newLvl, upgradeCost);
      }
      if (!canBeUpgradedAgain) {
        this.label.disable();
      }
    }
  }
}
