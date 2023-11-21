import { EnemyTemplate } from "./Enemy";
import { EnemyAtlas } from "./EnemyAtlas";

export const basicZombieEnemyTemplate: EnemyTemplate = {
  name: "Zombie",
  life: 100,
  speed: 3,
  atlas: EnemyAtlas.BasicZombieFront,
};
