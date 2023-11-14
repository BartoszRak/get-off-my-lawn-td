const createColorFromRaw = (raw: string) => parseInt(raw, 16);

export enum RawColor {
  Success = "00FF00",
  Error = "FF0000",
  Contour = "000000",
  Background = "FFFFFF",
  LightGrey = "EEEEEE",
  Grey = "DDDDDD",
  DarkGrey = "CCCCCC",
  LightText = "FFFFFF"
}

export enum Color {
  Success = createColorFromRaw(RawColor.Success),
  Error = createColorFromRaw(RawColor.Error),
  Contour = createColorFromRaw(RawColor.Contour),
  Background = createColorFromRaw(RawColor.Background),
  LightGrey = createColorFromRaw(RawColor.LightGrey),
  Grey = createColorFromRaw(RawColor.Grey),
  DarkGrey = createColorFromRaw(RawColor.DarkGrey),
}
