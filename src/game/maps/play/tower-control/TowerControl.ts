import { Position, Size } from "../../../../utils";
import { Color, RawColor } from "../../../Color";
import { PickTargeting } from "./pick-targeting/PickTargeting";
import { PickTower } from "../towers/PickTower";
import {
  TowerControlOptions,
  defaultTowerControlOptions,
} from "./TowerControlOptions";
import { Tower } from "../towers/specified-towers/Tower";
import { Upgrade } from "./upgrade/Upgrade";

export class TowerControl extends Phaser.GameObjects.Container {
  private readonly wrapper: Phaser.GameObjects.Rectangle;
  private readonly pickTargeting: PickTargeting;
  private readonly pickTargetingText: Phaser.GameObjects.Text;
  private readonly title: Phaser.GameObjects.Text;
  private readonly detailsText: Phaser.GameObjects.Text;
  private readonly upgrade: Upgrade;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    size: Size,
    private readonly tower: Tower,
    options: Partial<TowerControlOptions>
  ) {
    const { x, y } = position;
    super(scene, x, y);

    const { width, height } = size;
    const fullOptions = {
      ...defaultTowerControlOptions,
      ...options,
    };
    const wrapper = scene.add.rectangle(0, 0, width, height, Color.Warn, 1);
    const pickTargetingText = scene.add
      .text(0, height / 5, "Pick targeting", {
        color: RawColor.WarnContrast,
        align: "center",
        fontSize: 20,
      })
      .setOrigin(0.5);
    const pickTargeting = new PickTargeting(
      scene,
      { x: 0, y: height / 3 },
      {
        initial: fullOptions.initialTargeting,
        onChanged: fullOptions.onTargetingChanged,
      }
    );
    const rawTitle = this.createTitleText(tower);
    const title = scene.add
      .text(0, -height / 2.5, rawTitle, {
        color: RawColor.WarnContrast,
        align: "center",
        fontSize: 20,
      })
      .setOrigin(0.5);
    const detailsRawText = this.createDetailsText(tower);
    const detailsText = scene.add
      .text(0, -height / 4, detailsRawText, {
        color: RawColor.WarnContrast,
        align: "center",
        fontSize: 22,
      })
      .setOrigin(0.5);
    const upgrade = new Upgrade(scene, { x: 0, y: 0 }, tower, {
      onUpgraded: () => this.handleUpgrade(),
    });

    this.add([
      wrapper,
      pickTargeting,
      pickTargetingText,
      title,
      detailsText,
      upgrade,
    ]);
    scene.add.existing(this);

    this.wrapper = wrapper;
    this.pickTargeting = pickTargeting;
    this.pickTargetingText = pickTargetingText;
    this.title = title;
    this.detailsText = detailsText;
    this.upgrade = upgrade;
  }

  private handleUpgrade() {
    this.updateTitle(this.tower);
    this.updateDetails(this.tower);
  }

  private createTitleText(tower: Tower) {
    return `${tower.data.name} (lvl. ${
      tower.getCurrentLevel() + 1
    })`.toUpperCase();
  }

  private updateTitle(tower: Tower) {
    const newTitle = this.createTitleText(tower);
    this.title.setText(newTitle);
  }

  private createDetailsText(tower: Tower) {
    const data = tower.getCurrentData();
    return `Damage: ${data.damage}
    Range: ${data.range}
    Fire rate: ${data.rateOfFire}/s`;
  }

  private updateDetails(tower: Tower) {
    const newDetails = this.createDetailsText(tower);
    this.detailsText.setText(newDetails);
  }
}
