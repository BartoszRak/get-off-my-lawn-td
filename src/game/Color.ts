const createColorFromRaw = (raw: string) => parseInt(raw, 16);

export enum Color {
  Success = createColorFromRaw("00FF00"),
  Error = createColorFromRaw("FF0000"),
  Contour = createColorFromRaw("000000"),
  Background = createColorFromRaw("FFFFFF"),
}
