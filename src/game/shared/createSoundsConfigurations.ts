import { isDefined } from "../../utils";

export const createSoundsConfigurations = <
  K extends string,
  T extends Record<string, K>
>(
  enumerator: T,
  values: Record<K, string>
): Phaser.Types.Loader.FileTypes.AudioFileConfig[] => {
  return Object.values(enumerator)
    .map(
      (specifiedKey): Phaser.Types.Loader.FileTypes.ImageFileConfig | null => {
        const path = values[specifiedKey];
        console.info(`# Creating audio config for key "${specifiedKey}"`);
        if (!path) {
          const error = new Error(
            `!!! Missing audio path for "${specifiedKey}"`
          );
          console.error(error);
          return null;
        }
        return {
          key: specifiedKey,
          url: path,
        };
      }
    )
    .filter(isDefined);
};
