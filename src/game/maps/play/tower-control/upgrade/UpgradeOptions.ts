export interface UpgradeOptions {
  onUpgraded?: (oldLvl: number, newLvl: number) => void;
}
