export enum RawMap {
  Maya = "maya",
  Spiral = "spiral",
  Random = "random",
}

export const RawMaps: Record<string, [string, string]> = {
  [RawMap.Maya]: [RawMap.Maya, "assets/maps/maya.json"],
  [RawMap.Spiral]: [RawMap.Spiral, "assets/maps/spiral.json"],
  [RawMap.Random]: [RawMap.Random, "assets/maps/random.json"],
};
