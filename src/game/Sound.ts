export enum Sound {
  Bell = "bell",
  MachineGunShoot = "machine-gun-shoot",
  CannonShoot = "cannon-shoot",
  MissileLauncherShoot = "missile-launcher-shoot",
}

export const sounds: Record<Sound, string> = {
  [Sound.Bell]: "./assets/sounds/bell.wav",
  [Sound.MachineGunShoot]: "./assets/towers/machine_gun/shoot.ogg",
  [Sound.MissileLauncherShoot]: "./assets/towers/missile_launcher/shoot.ogg",
  [Sound.CannonShoot]: "./assets/towers/cannon/shoot.ogg",

};
