import { Node, NodeType, NormalMonsterNode } from "./Node";
import { renderBattlePage } from "../pages/battlePage";
import { Player } from "../creatures/Player";
import { CreatureType } from "../creatures/creatureConfigs";
import { Monster } from "../creatures/Monster";
import { renderMainMenu } from "../pages/mainMenu";
import { renderMapPage } from "../pages/mapPage";

export function handleAfterBattle(player: Player, _monster: Monster, result: boolean) {
  if (!result) {
    renderMainMenu(player);
  }
  renderMapPage(player);
}

export function handleNodeClick(node: Node, player: Player) {
  // 按权重随机选择一个怪物
  function randomMonster(monsterList: { monster: CreatureType; maxLevel: number; minLevel: number; weight: number }[]) {
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

  function randomMonsterLevel(minLevel: number, maxLevel: number) {
    return Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
  }

  if (node.type === NodeType.NormalMonster) {
    const monsterData = randomMonster((node as NormalMonsterNode).monsterList);
    if (!monsterData) {
      return;
    }
    const monsterLevel = randomMonsterLevel(monsterData.minLevel, monsterData.maxLevel);
    const monster = new Monster(monsterData.monster, monsterLevel, 1);
    renderBattlePage(player, monster, null, null, handleAfterBattle);
  }
}
