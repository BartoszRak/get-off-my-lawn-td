import { isDefined } from "../../utils";

export const createImagesConfigurations = <
  K extends string,
  T extends Record<string, K>
>(
  enumerator: T,
  values: Record<K, string>
): Phaser.Types.Loader.FileTypes.ImageFileConfig[] => {
  return Object.values(enumerator)
    .map(
      (
        specifiedKey
      ): Phaser.Types.Loader.FileTypes.ImageFileConfig | null => {
        const path = values[specifiedKey];
        console.info(`# Creating image config for key "${specifiedKey}"`);
        if (!path) {
          const error = new Error(
            `!!! Missing image path for "${specifiedKey}"`
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
