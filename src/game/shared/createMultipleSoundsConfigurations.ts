import { isDefined } from "../../utils";
import { createSoundConfiguration } from "./createSoundConfiguration";

export const createMultipleSoundsConfigurations = <
  K extends string,
  T extends Record<string, K>
>(
  enumerator: T,
  values: Record<K, string>
): Phaser.Types.Loader.FileTypes.AudioFileConfig[] => {
  return Object.values(enumerator)
    .map(
      (specifiedKey): Phaser.Types.Loader.FileTypes.AudioFileConfig | null => {
        return createSoundConfiguration(specifiedKey, values);
      }
    )
    .filter(isDefined);
};
