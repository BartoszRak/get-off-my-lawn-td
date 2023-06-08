import { Size } from "../../../utils";
import { ExportedCell } from "./ExportedCell";
import { RowsAndColumns } from "./RowsAndColumns";

export type ExportedGrid = Size &
  RowsAndColumns & {
    cells: ExportedCell[];
    pathIds: string[];
  };
