import { intToHex } from "./intToHex";

export const rgbIntToHex = (rgb: [number, number, number]) => {
  return rgb.reduce((acc, currentValue) => {
    const hex = intToHex(currentValue);
    const adjustedHex = hex.length === 1 ? `0${hex}` : hex;
    return acc + adjustedHex;
  }, "");
};
