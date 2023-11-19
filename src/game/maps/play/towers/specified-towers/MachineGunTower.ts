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
    },
    {
      cost: 120,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MachineGun2,
        bullet: TowerImage.MachineGunBullet,
      },
    },
    {
      cost: 140,
      images: {
        base: TowerImage.UniversalTowerBase,
        barrel: TowerImage.MachineGun3,
        bullet: TowerImage.MachineGunBullet,
      },
    },
  ],
};
