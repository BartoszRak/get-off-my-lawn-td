export interface UpgradeOptions {
  balance: number;
  onUpgraded?: (oldLvl: number, newLvl: number, upgradeCost: number) => void;
}

export const defaultUpgradeOptions: UpgradeOptions = {
  balance: 0,
};
