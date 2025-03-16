import { HitCategory } from "../actions/types";
import type { Action, Hit } from "../actions/Action";
import { getHitsDescription } from "../actions/actionUtils";
import type { Player } from "../creatures/Player";
import { Monster } from "../creatures/Monster";
import { getHitIcon } from "../tools";
import { renderMainMenu } from "../pages/mainMenu";
import { renderBattlePage } from "../pages/battlePage";

export function calculateDamage(power: number, armor: number) {
  return power * (25 / (armor + 25));
}

// 生成拼点字符串
export function generatePointString(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
  playerPower: number,
  enemyPower: number,
) {
  let playerPoint = "";
  let enemyPoint = "";
  if (playerHit.category === HitCategory.None) {
    playerPoint = playerHit.messageGenerator(player, enemy);
  } else {
    playerPoint =
      player.name +
      getHitIcon(playerHit) +
      '<span style="color: blue;">' +
      Math.round(playerPower) +
      "</span> ";
  }
  if (enemyHit.category === HitCategory.None) {
    enemyPoint = enemyHit.messageGenerator(enemy, player);
  } else {
    enemyPoint =
      enemy.name +
      getHitIcon(enemyHit) +
      '<span style="color: orange;">' +
      Math.round(enemyPower) +
      "</span> ";
  }
  return "掷骰：" + playerPoint + enemyPoint;
}

export function observeEnemyAction(
  player: Player,
  enemy: Monster,
  realAction: Action,
): string {
  function generateMsg(enemy: Monster, action: Action) {
    return (
      enemy.name +
      "看起来似乎会使用" +
      action.name +
      "<br>" +
      getHitsDescription(enemy, action)
    );
  }

  if (
    Math.random() * player.getAbility().int >
    Math.random() * enemy.getAbility().int
  ) {
    return generateMsg(enemy, realAction);
  } else {
    return "你分辨不出" + enemy.name + "即将使用的动作";
  }
}

import { creatureConfigs, CreatureType } from "../creatures/creatureConfigs";

export function testBattle(player: Player): void {
  let enemyType =
    Object.values(CreatureType)[
      Math.floor(Math.random() * Object.values(CreatureType).length)
    ];
  if (
    enemyType === CreatureType.Player ||
    enemyType === CreatureType.Player114514
  ) {
    enemyType = CreatureType.Wolf;
  }
  const enemyLevel = Math.floor(Math.random() * 10) + 1;
  const enemyIndividualStrength = Math.random() * 2;
  const enemy = new Monster(
    creatureConfigs[enemyType].typeName,
    enemyType,
    enemyLevel,
    enemyIndividualStrength,
  );
  renderBattlePage(player, enemy, null, null, (player: Player, _enemy: Monster, _result: boolean) => {
    renderMainMenu(player);
  });
}
