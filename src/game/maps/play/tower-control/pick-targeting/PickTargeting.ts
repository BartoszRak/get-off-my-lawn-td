import { Position } from "../../../../../utils";
import { Label } from "../../../../shared";
import { TowerTargeting } from "../../towers/TowerTargeting";
import {
  PickTargetingOptions,
  defaultPickTargetingOptions,
} from "./PickTargetingOptions";

export class PickTargeting extends Phaser.GameObjects.Container {
  private targeting: TowerTargeting;
  private readonly onChanged?: PickTargetingOptions["onChanged"];
  private readonly text: Label;

  constructor(
    scene: Phaser.Scene,
    position: Position,
    options: Partial<PickTargetingOptions>
  ) {
    const { x, y } = position;
    const { initial, onChanged } = {
      ...defaultPickTargetingOptions,
      ...options,
    };
    super(scene, x, y);

    this.targeting = initial;
    this.onChanged = onChanged;

    const text = this.scene.add.existing(
      new Label(scene, { x: 0, y: 0 }, initial)
    );
    const prev = this.scene.add.existing(
      new Label(scene, { x: 0 - text.width, y: 0 }, "<<", {
        onClick: () => this.handlePrev(),
      })
    );
    const next = this.scene.add.existing(
      new Label(scene, { x: 0 + text.width, y: 0 }, ">>", {
        onClick: () => this.handleNext(),
      })
    );
    this.add([prev, text, next]);
    this.scene.add.existing(this);
    this.text = text;
  }

  private handleNext() {
    const values = Object.values(TowerTargeting);
    const currentIndex = values.findIndex(
      (specifiedValue) => specifiedValue === this.targeting
    );
    const nextIndex = currentIndex + 1;
    const newValue =
      nextIndex === values.length ? values[0] : values[nextIndex];
    this.updateTargeting(newValue);
  }

  private handlePrev() {
    const values = Object.values(TowerTargeting);
    const currentIndex = values.findIndex(
      (specifiedValue) => specifiedValue === this.targeting
    );
    const prevIndex = currentIndex - 1;
    const newValue =
      prevIndex < 0 ? values[values.length - 1] : values[prevIndex];
    this.updateTargeting(newValue);
  }

  private updateTargeting(newValue: TowerTargeting) {
    if (newValue) {
      this.targeting = newValue;
      this.text.setText(newValue);
      if (this.onChanged) {
        this.onChanged(newValue);
      }
    }
  }
}
