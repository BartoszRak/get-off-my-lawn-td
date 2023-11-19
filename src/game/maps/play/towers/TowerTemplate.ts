import { TowerImage } from "../../../TowerImage";

export interface TowerLevel {
  images: {
    base: TowerImage;
    barrel: TowerImage;
    bullet: TowerImage;
  };
  cost: number;
}

export interface TowerTemplate {
  name: string;
  levels: TowerLevel[];
}
