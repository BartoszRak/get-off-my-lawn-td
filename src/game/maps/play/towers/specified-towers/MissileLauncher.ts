import { TowerImage } from "../../../../TowerImage";
import { TowerTemplate } from "../TowerTemplate";

export const missileLauncherTowerTemplate: TowerTemplate = {
  name: "Missile launcher",
  levels: [
    {
      cost: 100,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MissileLauncher1,
        bullet: TowerImage.MissileLauncherBullet,
      },
    },
    {
      cost: 120,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MissileLauncher2,
        bullet: TowerImage.MissileLauncherBullet,
      },
    },
    {
      cost: 140,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MissileLauncher3,
        bullet: TowerImage.MissileLauncherBullet,
      },
    },
  ],
};
