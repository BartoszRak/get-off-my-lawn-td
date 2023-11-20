import { TowerImage } from "../../../../TowerImage";
import { TowerTemplate } from "../TowerTemplate";

export const machineGunTowerTemplate: TowerTemplate = {
  name: "Machine gun",
  levels: [
    {
      cost: 100,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MachineGun1,
        bullet: TowerImage.MachineGunBullet,
      },
      range: 100,
      rateOfFire: 2,
      damage: 6,
    },
    {
      cost: 120,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MachineGun2,
        bullet: TowerImage.MachineGunBullet,
      },
      range: 115,
      rateOfFire: 2.5,
      damage: 6,
    },
    {
      cost: 140,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MachineGun3,
        bullet: TowerImage.MachineGunBullet,
      },
      range: 130,
      rateOfFire: 3,
      damage: 7,
    },
  ],
};
