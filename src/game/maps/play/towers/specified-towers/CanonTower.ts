import { Sound } from "../../../../Sound";
import { TowerImage } from "../../../../TowerImage";
import { TowerTargeting } from "../TowerTargeting";
import { TowerTemplate } from "../TowerTemplate";

export const canonTowerTemplate: TowerTemplate = {
  name: "Cannon gun",
  shotSound: Sound.CannonShoot,
  defaultTargeting: TowerTargeting.Strongest,
  levels: [
    {
      cost: 100,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.Cannon1,
        bullet: TowerImage.CannonBullet,
      },
      range: 100,
      rateOfFire: 1,
      damage: 10,
    },
    {
      cost: 120,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.Cannon2,
        bullet: TowerImage.CannonBullet,
      },
      range: 120,
      rateOfFire: 1.1,
      damage: 12,
    },
    {
      cost: 140,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.Cannon3,
        bullet: TowerImage.CannonBullet,
      },
      range: 140,
      rateOfFire: 1.2,
      damage: 14,
    },
  ],
};
