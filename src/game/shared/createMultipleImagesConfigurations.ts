import { isDefined } from "../../utils";
import { createImageConfiguration } from "./createImageConfiguration";

export const createMultipleImagesConfigurations = <
  K extends string,
  T extends Record<string, K>,
>(
  enumerator: T,
  values: Record<K, string>,
): Phaser.Types.Loader.FileTypes.ImageFileConfig[] => {
  return Object.values(enumerator)
    .map(
      (specifiedKey): Phaser.Types.Loader.FileTypes.ImageFileConfig | null => {
        return createImageConfiguration(specifiedKey, values);
      },
    )
    .filter(isDefined);
};
