export const createSoundConfiguration = <K extends string>(
  key: K,
  values: Record<K, string>
): Phaser.Types.Loader.FileTypes.AudioFileConfig => {
  const path = values[key];
  console.info(`# Creating audio config for key "${key}"`);
  if (!path) {
    const error = new Error(`!!! Missing audio path for "${key}"`);
    console.error(error);
    throw error;
  }
  return {
    key: key,
    url: path,
  };
};
