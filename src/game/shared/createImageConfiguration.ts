export const createImageConfiguration = <K extends string>(
  key: K,
  values: Record<K, string>,
): Phaser.Types.Loader.FileTypes.ImageFileConfig => {
  const path = values[key];
  console.info(`# Creating image config for key "${key}"`);
  if (!path) {
    const error = new Error(`!!! Missing image path for "${key}"`);
    console.error(error);
    throw error;
  }
  return {
    key: key,
    url: path,
  };
};
