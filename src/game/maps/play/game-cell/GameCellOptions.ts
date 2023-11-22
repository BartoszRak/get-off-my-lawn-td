import { Tower } from "../towers/specified-towers/Tower";
import { GameCell } from "./GameCell";

export interface GameCellOptions {
  isPath?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  onPicked?: (cell: GameCell) => void;
  onTowerPlaced?: (tower: Tower) => void;
  onBuiltTowerClicked?: (tower: Tower, cell: GameCell) => void;
  towerSizePercentage: number;
}

export const defaultGameCellOptions: GameCellOptions = {
  towerSizePercentage: 1,
};
