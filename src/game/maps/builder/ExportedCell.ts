import { Position, Size } from "../../../utils";

export type ExportedCell = Position &
  Size & {
    isPath: boolean;
    isEntry: boolean;
    id: string;
    column: number;
    row: number;
  };
