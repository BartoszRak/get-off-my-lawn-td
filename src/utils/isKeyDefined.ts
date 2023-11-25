import { Optional } from "utility-types";

export const isKeyDefined = <T extends object, K extends keyof T = keyof T>(
  value: Optional<T, K>,
  key: K,
): value is T => value[key] !== null && value[key] !== undefined;
