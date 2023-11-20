import { Sound } from "../../../Sound";
import { TowerImage } from "../../../TowerImage";

export interface TowerLevel {
  images: {
    base: TowerImage;
    barrel: TowerImage;
    bullet: TowerImage;
  };
  range: number;
  rateOfFire: number;
  damage: number;
  cost: number;
}

export interface TowerTemplate {
  name: string;
  shotSound: Sound;
  levels: TowerLevel[];
}
