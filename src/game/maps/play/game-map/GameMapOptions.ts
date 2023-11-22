import { GameCell } from "../game-cell/GameCell";
import { Tower } from "../towers/specified-towers/Tower";

export interface GameMapOptions<T> {
  isButton?: boolean;
  onClick?: (map: T) => void;
  onPicked?: (cell: GameCell) => void;
  onBuiltTowerClicked?: (tower: Tower, cell: GameCell) => void;
}
