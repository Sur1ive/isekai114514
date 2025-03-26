import { CreatureType } from "./creatureConfigs";

// 按权重随机选择一个怪物
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function randomMonsterType(monsterList: { monster: CreatureType; weight: number; [key: string]: any }[]) {
  const totalWeight = monsterList.reduce((sum, monster) => sum + monster.weight, 0);
  const randomValue = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  for (const monster of monsterList) {
    cumulativeWeight += monster.weight;
    if (randomValue <= cumulativeWeight) {
      return monster;
    }
  }
}
