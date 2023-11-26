import { TowerTargeting } from "../towers/TowerTargeting";

export interface TowerControlOptions {
  onTargetingChanged?: (targeting: TowerTargeting) => void;
  onUpgraded?: (oldLvl: number, newLvl: number, upgradeCost: number) => void;
  initialTargeting: TowerTargeting;
}

export const defaultTowerControlOptions: TowerControlOptions = {
  initialTargeting: TowerTargeting.First,
};
