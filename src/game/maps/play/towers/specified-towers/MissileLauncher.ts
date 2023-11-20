import { Sound } from "../../../../Sound";
import { TowerImage } from "../../../../TowerImage";
import { TowerTemplate } from "../TowerTemplate";

export const missileLauncherTowerTemplate: TowerTemplate = {
  name: "Missile launcher",
  shotSound: Sound.MissileLauncherShoot,
  levels: [
    {
      cost: 100,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MissileLauncher1,
        bullet: TowerImage.MissileLauncherBullet,
      },
      range: 200,
      rateOfFire: 0.5,
      damage: 30,
    },
    {
      cost: 120,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MissileLauncher2,
        bullet: TowerImage.MissileLauncherBullet,
      },
      range: 250,
      rateOfFire: 0.5,
      damage: 45,
    },
    {
      cost: 140,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MissileLauncher3,
        bullet: TowerImage.MissileLauncherBullet,
      },
      range: 300,
      rateOfFire: 0.5,
      damage: 60,
    },
  ],
};
