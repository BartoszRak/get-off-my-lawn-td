import { TowerImage } from "../../../../TowerImage";
import { TowerTemplate } from "../TowerTemplate";

export const canonTowerTemplate: TowerTemplate = {
  name: "Cannon gun",
  levels: [
    {
      cost: 100,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.Cannon1,
        bullet: TowerImage.CannonBullet,
      },
    },
    {
      cost: 120,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.Cannon2,
        bullet: TowerImage.CannonBullet,
      },
    },
    {
      cost: 140,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.Cannon3,
        bullet: TowerImage.CannonBullet,
      },
    },
  ],
};
