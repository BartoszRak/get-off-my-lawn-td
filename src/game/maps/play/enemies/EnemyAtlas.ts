import { AtlasFiles } from "../../../shared";

export enum EnemyAtlas {
  BasicZombieLeft = "basic-zombie-left",
  BasicZombieRight = "basic-zombie-right",
  BasicZombieFront = "basic-zombie-front",
  BasicZombieBack = "basic-zombie-back",
}

export const EnemyAtlases: Record<EnemyAtlas, AtlasFiles> = {
  [EnemyAtlas.BasicZombieFront]: {
    json: "./assets/enemies/basic_zombie/basic_zombie_front.json",
    image: "./assets/enemies/basic_zombie/basic_zombie_front.png",
  },
  [EnemyAtlas.BasicZombieBack]: {
    json: "./assets/enemies/basic_zombie/basic_zombie_back.json",
    image: "./assets/enemies/basic_zombie/basic_zombie_back.png",
  },
  [EnemyAtlas.BasicZombieLeft]: {
    json: "./assets/enemies/basic_zombie/basic_zombie_left.json",
    image: "./assets/enemies/basic_zombie/basic_zombie_left.png",
  },
  [EnemyAtlas.BasicZombieRight]: {
    json: "./assets/enemies/basic_zombie/basic_zombie_right.json",
    image: "./assets/enemies/basic_zombie/basic_zombie_right.png",
  },
};
