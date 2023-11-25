import { Optional, OptionalKeys } from "utility-types";
import { TowerTargeting } from "../../towers/TowerTargeting";

export interface PickTargetingOptions {
  initial: TowerTargeting;
  onChanged?: (targeting: TowerTargeting) => void;
}

export const defaultPickTargetingOptions: PickTargetingOptions = {
  initial: TowerTargeting.First,
};
