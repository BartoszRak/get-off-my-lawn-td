import { EnemyTemplate } from "./Enemy";

export const applyEnemyMultiplier = (
  template: EnemyTemplate,
  multiplier: number
) => {
  const { life, speed, ...restOfTemplate } = template;
  return {
    ...restOfTemplate,
    life: life * multiplier,
    speed: speed * multiplier,
  };
};
