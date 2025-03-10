import { ActionCoeff, ActionCategory } from "../actions/types";
import type { Action, Hit } from "../actions/Action";
import type { Ability } from "../creatures/types";
import { Player } from "../creatures/Player";
import { Monster } from "../creatures/Monster";
import { NoHit } from "../actions/actionConfigs";

export function calculateMaxPower(coeff: ActionCoeff, ability: Ability) {
  return (coeff.str * ability.str + coeff.dex * ability.dex
  + coeff.int * ability.int + coeff.con * ability.con
  + coeff.siz * ability.siz + coeff.app * ability.app);
}

function calculatePower(coeff: ActionCoeff, ability: Ability) {
  return (coeff.str * ability.str + coeff.dex * ability.dex
  + coeff.int * ability.int + coeff.con * ability.con
  + coeff.siz * ability.siz + coeff.app * ability.app) * Math.random();
}

function calculateDamage(power: number, armor: number) {
  return power * (25 / (armor + 25));
}

function attackAgainstAttack(player: Player, enemy: Monster, playerHit: Hit, enemyHit: Hit) {
  const playerPower = calculatePower(playerHit.coeff, player.ability);
  const enemyPower = calculatePower(enemyHit.coeff, enemy.ability);
  player.addTempLog(player.name + "使用了" + playerAction.name + "掷出了<span style=\"color: blue;\">" + Math.round(playerPower) + "</span>，" + enemy.name + "使用了" + enemyAction.name + "掷出了<span style=\"color: orange;\">" + Math.round(enemyPower) + "</span>");
  if (playerPower >= enemyPower) {
    const damage = calculateDamage(playerPower, enemy.ability.armor);
    enemy.health -= damage;
    player.addTempLog(player.name + "使用了" + playerAction.name + "弹开了" + enemy.name + "的" + enemyAction.name + "(attack vs attack)");
    player.addTempLog(playerAction.messageGenerator(player, enemy) + "造成了<span style=\"color: red;\">" + Math.round(damage) + "</span>点伤害");
    playerAction.extraEffect ? playerAction.extraEffect(player, enemy) : null;
  } else {
    const damage = calculateDamage(enemyPower, player.ability.armor);
    player.health -= damage;
    player.addTempLog(enemy.name + "使用了" + enemyAction.name + "弹开了" + player.name + "的" + playerAction.name + "(attack vs attack)");
    player.addTempLog(enemyAction.messageGenerator(enemy, player) + "造成了<span style=\"color: red;\">" + Math.round(damage) + "</span>点伤害");
    enemyAction.extraEffect ? enemyAction.extraEffect(enemy, player) : null;
  }
}

function attackAgainstNoAction(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  let actor;
  let target;
  let action;
  if (enemyAction.category === ActionCategory.NoAction) {
    actor = player;
    target = enemy;
    action = playerAction;
  } else {
    actor = enemy;
    target = player;
    action = enemyAction;
  }

  const power = calculatePower(action.coeff, actor.ability);
  player.addTempLog(actor.name + "使用了" + action.name + "掷出了<span style=\"color: blue;\">" + Math.round(power) + "</span>");
  player.addTempLog(target.name + "被打了个措手不及(attack vs none)");
  const damage = calculateDamage(power, target.ability.armor);
  target.health -= damage;
  player.addTempLog(action.messageGenerator(actor, target) + "造成了<span style=\"color: red;\">" + Math.round(damage) + "</span>点伤害");
  action.extraEffect ? action.extraEffect(actor, target) : null;
}

function attackAgainstDefend(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  const playerPower = calculatePower(playerAction.coeff, player.ability);
  const enemyPower = calculatePower(enemyAction.coeff, enemy.ability);
  player.addTempLog(player.name + "使用了" + playerAction.name + "掷出了<span style=\"color: blue;\">" + Math.round(playerPower) + "</span>，" + enemy.name + "使用了" + enemyAction.name + "掷出了<span style=\"color: orange;\">" + Math.round(enemyPower) + "</span>");

  const isPlayerAttack = playerAction.category === ActionCategory.Defend ? false : true;
  const attacker = isPlayerAttack ? player : enemy;
  const defender = isPlayerAttack ? enemy : player;
  const attackerAction = isPlayerAttack ? playerAction : enemyAction;
  const defenderAction = isPlayerAttack ? enemyAction : playerAction;
  const attackerPower = isPlayerAttack ? playerPower : enemyPower;
  const defenderPower = isPlayerAttack ? enemyPower : playerPower;
  player.addTempLog(defender.name + "使用了" + defenderAction.name + "防御" + attacker.name + "的" + attackerAction.name + "(attack vs defend)");
  const power = attackerPower - defenderPower > 0 ? attackerPower - defenderPower : 0;
  const damage = calculateDamage(power, defender.ability.armor);
  defender.health -= damage;
  if (power > 0) {
    player.addTempLog(defenderAction.messageGenerator(defender, attacker) + "," + attackerAction.messageGenerator(attacker, defender) + "造成了<span style=\"color: red;\">" + Math.round(damage) + "</span>点伤害");
  } else {
    player.addTempLog(defenderAction.messageGenerator(defender, attacker) + "," + attackerAction.messageGenerator(attacker, defender) + "但没有造成伤害");
  }
}

export function handleAction(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  let i = 0;
  while (playerAction.hits[i] || enemyAction.hits[i]) {
    const playerHit = playerAction.hits[i] || NoHit;
    const enemyHit = enemyAction.hits[i] || NoHit;
    if (playerHit.category === ActionCategory.Attack && enemyHit.category === ActionCategory.Attack) {
      attackAgainstAttack(player, enemy, playerHit, enemyHit);
    }
    if ((playerHit.category === ActionCategory.Attack && enemyHit.category === ActionCategory.NoAction) || (playerHit.category === ActionCategory.NoAction && enemyHit.category === ActionCategory.Attack)) {
      attackAgainstNoAction(player, enemy, playerHit, enemyHit);
    }
    if (playerHit.category === ActionCategory.Attack && enemyHit.category === ActionCategory.Defend || playerHit.category === ActionCategory.Defend && enemyHit.category === ActionCategory.Attack) {
      attackAgainstDefend(player, enemy, playerHit, enemyHit);
    }
    i++;
  }
}

export function observeEnemyAction(player: Player, enemy: Monster, realAction: Action): string {
  function generateMsg(enemy: Monster, action: Action) {
    return enemy.name + "看起来似乎会" + action.name; // 加个bootstrap的tooltips
  }

  if (Math.random() * player.ability.dex > Math.random() * enemy.ability.dex) {
    if (Math.random() * player.ability.int > Math.random() * enemy.ability.int) {
      return generateMsg(enemy, realAction);
    } else {
      return generateMsg(enemy, enemy.getRandomAction());
    }
  } else {
    return "你来不及观察" + enemy.name + "的行动";
  }
}
