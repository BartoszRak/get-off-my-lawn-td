import { EnemyTemplate } from "./Enemy";
import { EnemyAtlas } from "./EnemyAtlas";

export const basicZombieEnemyTemplate: EnemyTemplate = {
  name: "Zombie",
  life: 10,
  speed: 10,
  atlas: EnemyAtlas.BasicZombieFront,
};
