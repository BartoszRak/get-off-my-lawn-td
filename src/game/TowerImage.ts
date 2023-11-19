export enum TowerImage {
  MachineGun1 = "machine-gun1",
  MachineGun2 = "machine-gun2",
  MachineGun3 = "machine-gun3",
  MachineGunBullet = "machine-gun-bullet",

  MissileLauncher1 = "missile-launcher1",
  MissileLauncher2 = "missile-launcher2",
  MissileLauncher3 = "missile-launcher3",
  MissileLauncherBullet = "missile-launcher-bullet",

  Cannon1 = "cannon1",
  Cannon2 = "cannon2",
  Cannon3 = "cannon3",
  CannonBullet = "cannon-bullet",

  UniversalTowerBase = "universal-tower-base",
}

export const TowerImages: Record<string, string> = {
  [TowerImage.MachineGun1]: "./assets/towers/machine_gun/machine_gun1.png",
  [TowerImage.MachineGun2]: "./assets/towers/machine_gun/machine_gun2.png",
  [TowerImage.MachineGun3]: "./assets/towers/machine_gun/machine_gun3.png",
  [TowerImage.MachineGunBullet]:
    "./assets/towers/machine_gun/machine_gun_bullet.png",
  [TowerImage.MissileLauncher1]:
    "./assets/towers/missile_launcher/missile_launcher1.png",
  [TowerImage.MissileLauncher2]:
    "./assets/towers/missile_launcher/missile_launcher2.png",
  [TowerImage.MissileLauncher3]:
    "./assets/towers/missile_launcher/missile_launcher3.png",
  [TowerImage.MissileLauncherBullet]:
    "./assets/towers/missile_launcher/missile_launcher_bullet.png",
  [TowerImage.Cannon1]: "./assets/towers/cannon/cannon1.png",
  [TowerImage.Cannon2]: "./assets/towers/cannon/cannon2.png",
  [TowerImage.Cannon3]: "./assets/towers/cannon/cannon3.png",
  [TowerImage.CannonBullet]: "./assets/towers/cannon/cannon_bullet.png",
  [TowerImage.UniversalTowerBase]: "./assets/towers/universal_tower_base.png",
};
