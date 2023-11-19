export const createColorFromRaw = (raw: string) =>
  parseInt(raw.replaceAll("#", ""), 16);

export enum RawColor {
  Success = "#00FF00",
  SuccessContrast = "#000000",

  Error = "#FF0000",
  ErrorContrast = "#FFFFFF",
  Contour = "#000000",
  Background = "#FFFFFF",
  LightGrey = "#EEEEEE",
  Grey = "#DDDDDD",
  DarkGrey = "#CCCCCC",

  LightText = "#FFFFFF",
  DarkText = "#000000",

  Dark = "#000000",
  Light = "#FFFFFF",
  LightContrast = "#000000",
  DarkContrast = "#FFFFFF",

  Warn = "#FFFF00",
  WarnContrast = "#000000",
  
}

export enum Color {
  Success = createColorFromRaw(RawColor.Success),
  SuccessContrast = createColorFromRaw(RawColor.SuccessContrast),
  Error = createColorFromRaw(RawColor.Error),
  ErrorContrast = createColorFromRaw(RawColor.ErrorContrast),
  Contour = createColorFromRaw(RawColor.Contour),
  Background = createColorFromRaw(RawColor.Background),
  LightGrey = createColorFromRaw(RawColor.LightGrey),
  Grey = createColorFromRaw(RawColor.Grey),
  DarkGrey = createColorFromRaw(RawColor.DarkGrey),

  LightText = createColorFromRaw(RawColor.LightText),
  DarkText = createColorFromRaw(RawColor.DarkText),

  Dark = createColorFromRaw(RawColor.Dark),
  Light = createColorFromRaw(RawColor.Light),
  LightContrast = createColorFromRaw(RawColor.LightContrast),
  DarkContrast = createColorFromRaw(RawColor.DarkContrast),

  Warn = createColorFromRaw(RawColor.Warn),
  WarnContrast = createColorFromRaw(RawColor.WarnContrast),
}
