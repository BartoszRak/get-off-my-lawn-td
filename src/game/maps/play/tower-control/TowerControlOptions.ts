import { TowerTargeting } from "../towers/TowerTargeting";

export interface TowerControlOptions {
  onTargetingChanged?: (targeting: TowerTargeting) => void;
  initialTargeting: TowerTargeting;
}

export const defaultTowerControlOptions: TowerControlOptions = {
  initialTargeting: TowerTargeting.First,
};
