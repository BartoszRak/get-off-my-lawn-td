import { TinyTypeOf } from "tiny-types";

export class CellId extends TinyTypeOf<string>() {
  constructor(row: number, column: number) {
    super(`${row}-${column}`);
  }

  static fromExisting(id: string) {
    const [row, column] = id.split("-");
    return new CellId(Number(row), Number(column));
  }
}
