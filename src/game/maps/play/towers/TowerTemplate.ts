import { Image } from "../../../Images";

export interface TowerImages {
  base: Image;
  barrel: Image;
}

export interface TowerTemplate {
  name: string;
  images: TowerImages;
}
