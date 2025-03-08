import { Player } from "../creatures/Player";
import { Monster } from "../creatures/Monster";
import { Action, ActionCoeff, ActionType, ActionResult } from "../actions/Action";
import { Ability } from "../creatures/Creature";


function calculatePower(coeff: ActionCoeff, ability: Ability) {
  return (coeff.str * ability.str + coeff.dex * ability.dex
  + coeff.int * ability.int + coeff.con * ability.con
  + coeff.siz * ability.siz + coeff.app * ability.app) * Math.random();
}

function calculateDamage(power: number, armor: number) {
  return power * (25 / (armor + 25));
}

function attackAgainstAttack(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  const playerPower = calculatePower(playerAction.coeff, player.ability);
  const enemyPower = calculatePower(enemyAction.coeff, enemy.ability);
  player.addLog(player.name + "使用了" + playerAction.name + "掷出了<span style=\"color: blue;\">" + Math.round(playerPower) + "</span>，" + enemy.name + "使用了" + enemyAction.name + "掷出了<span style=\"color: orange;\">" + Math.round(enemyPower) + "</span>");
  if (playerPower >= enemyPower) {
    const damage = calculateDamage(playerPower, enemy.ability.armor);
    enemy.health -= damage;
    player.addLog(player.name + "使用了" + playerAction.name + "弹开了" + enemy.name + "的" + enemyAction.name + "(attack vs attack)");
    player.addLog(playerAction.messageGenerator(player, enemy, ActionResult.Success) + "造成了<span style=\"color: red;\">" + Math.round(damage) + "</span>点伤害");
  } else {
    const damage = calculateDamage(enemyPower, player.ability.armor);
    player.health -= damage;
    player.addLog(enemy.name + "使用了" + enemyAction.name + "弹开了" + player.name + "的" + playerAction.name);
    player.addLog(enemyAction.messageGenerator(enemy, player, ActionResult.Success) + "造成了<span style=\"color: red;\">" + Math.round(damage) + "</span>点伤害");
  }
}

function attackAgainstNoAction(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  let actor;
  let target;
  let action;
  if (enemyAction.type === ActionType.NoAction) {
    actor = player;
    target = enemy;
    action = playerAction;
  } else {
    actor = enemy;
    target = player;
    action = enemyAction;
  }

  const power = calculatePower(action.coeff, actor.ability);
  player.addLog(actor.name + "使用了" + action.name + "掷出了<span style=\"color: blue;\">" + Math.round(power) + "</span>)");
  player.addLog(target.name + "被打了个措手不及(attack vs none)");
  const damage = calculateDamage(power, target.ability.armor);
  target.health -= damage;
  player.addLog(action.messageGenerator(actor, target, ActionResult.Success) + "造成了<span style=\"color: red;\">" + Math.round(damage) + "</span>点伤害");
}

export function handleAction(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  if (playerAction.type === ActionType.Attack && enemyAction.type === ActionType.Attack) {
    attackAgainstAttack(player, enemy, playerAction, enemyAction);
  }
}

export function statusCheck(player: Player, enemy: Monster) {
  if (player.health <= 0) {
    player.addLog(player.name + "撑不住了");
    return "die";
  }
  if (enemy.health <= 0) {
    player.addLog(enemy.name + "死了");
    return "win";
  }
  return "continue";
}

export function observeEnemyAction(player: Player, enemy: Monster, realAction: Action): string {
  if (Math.random() * player.ability.dex > Math.random() * enemy.ability.dex) {
    if (Math.random() * player.ability.int > Math.random() * enemy.ability.int) {
      return enemy.name + "看起来要" + realAction.name + "了";
    } else {
      return enemy.name + "看起来要" + enemy.getRandomAction().name + "了";
    }
  } else {
    return "你来不及观察" + enemy.name + "的行动";
  }
}
