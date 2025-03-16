import { Player } from "../creatures/Player";
import { Monster } from "../creatures/Monster";
import { Action, Hit } from "../actions/Action";
import { HitCategory } from "../actions/types";
import { NoHit } from "../actions/actionConfigs";
import { calculatePower, calculateDamage, generatePointString } from "./battle";
import { getHitIcon } from "../tools";

export function handleAction(
  player: Player,
  enemy: Monster,
  playerAction: Action,
  enemyAction: Action,
) {
  player.addTempLog(
    player.name +
      "使用了" +
      playerAction.name +
      "，" +
      enemy.name +
      "使用了" +
      enemyAction.name,
  );

  let i = 0;
  while (playerAction.hits[i] || enemyAction.hits[i]) {
    const playerHit = playerAction.hits[i] || NoHit;
    const enemyHit = enemyAction.hits[i] || NoHit;
    if (playerHit.category === HitCategory.Capture) {
      playerHit.category = HitCategory.Attack;
    }
    if (
      playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.Attack
    ) {
      attackAgainstAttack(player, enemy, playerHit, enemyHit);
    } else if (
      (playerHit.category === HitCategory.Attack &&
        enemyHit.category === HitCategory.None) ||
      (playerHit.category === HitCategory.None &&
        enemyHit.category === HitCategory.Attack)
    ) {
      attackAgainstNone(player, enemy, playerHit, enemyHit);
    } else if (
      (playerHit.category === HitCategory.Attack &&
        enemyHit.category === HitCategory.Defend) ||
      (playerHit.category === HitCategory.Defend &&
        enemyHit.category === HitCategory.Attack)
    ) {
      attackAgainstDefend(player, enemy, playerHit, enemyHit);
    } else if (
      (playerHit.category === HitCategory.Dodge &&
        enemyHit.category === HitCategory.Attack) ||
      (playerHit.category === HitCategory.Attack &&
        enemyHit.category === HitCategory.Dodge)
    ) {
      const result = attackAgainstDodge(player, enemy, playerHit, enemyHit);
      if (result === "player" && playerAction.hits[i + 1]) {
        playerAction.hits[i + 1] = NoHit;
      } else if (result === "enemy" && enemyAction.hits[i + 1]) {
        enemyAction.hits[i + 1] = NoHit;
      }
    } else {
      player.addTempLog(
        "无事发生(" +
          player.name +
          getHitIcon(playerHit) +
          " " +
          enemy.name +
          getHitIcon(enemyHit) +
          ")",
      );
    }
    i++;
  }
}

function attackAgainstAttack(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
) {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility());
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility());
  player.addTempLog(
    generatePointString(
      player,
      enemy,
      playerHit,
      enemyHit,
      playerPower,
      enemyPower,
    ),
  );
  if (playerPower >= enemyPower) {
    const damage = calculateDamage(playerPower, enemy.getAbility().armor);
    enemy.health -= damage;
    player.addTempLog(
      playerHit.messageGenerator(player, enemy) +
        '造成了<span style="color: red;">' +
        Math.round(damage) +
        "</span>点伤害",
    );
    if (playerHit.extraEffect) {
      playerHit.extraEffect(player, enemy);
    }
  } else {
    const damage = calculateDamage(enemyPower, player.getAbility().armor);
    player.health -= damage;
    player.addTempLog(
      enemyHit.messageGenerator(enemy, player) +
        '造成了<span style="color: red;">' +
        Math.round(damage) +
        "</span>点伤害",
    );
    if (enemyHit.extraEffect) {
      enemyHit.extraEffect(enemy, player);
    }
  }
}

function attackAgainstNone(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
) {
  let actor;
  let target;
  let action;
  if (enemyHit.category === HitCategory.None) {
    actor = player;
    target = enemy;
    action = playerHit;
  } else {
    actor = enemy;
    target = player;
    action = enemyHit;
  }

  const power = calculatePower(action.coeff, actor.getAbility());
  player.addTempLog(
    generatePointString(
      player,
      enemy,
      playerHit,
      enemyHit,
      actor instanceof Player ? power : 0,
      actor instanceof Monster ? power : 0,
    ),
  );
  const damage = calculateDamage(power, target.getAbility().armor);
  target.health -= damage;
  player.addTempLog(
    action.messageGenerator(actor, target) +
      '造成了<span style="color: red;">' +
      Math.round(damage) +
      "</span>点伤害",
  );
  if (action.extraEffect) {
    action.extraEffect(actor, target);
  }
}

function attackAgainstDefend(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
) {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility());
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility());
  player.addTempLog(
    generatePointString(
      player,
      enemy,
      playerHit,
      enemyHit,
      playerPower,
      enemyPower,
    ),
  );

  const isPlayerAttack =
    playerHit.category === HitCategory.Attack ? true : false;
  const attacker = isPlayerAttack ? player : enemy;
  const defender = isPlayerAttack ? enemy : player;
  const attackerAction = isPlayerAttack ? playerHit : enemyHit;
  const defenderAction = isPlayerAttack ? enemyHit : playerHit;
  const attackerPower = isPlayerAttack ? playerPower : enemyPower;
  const defenderPower = isPlayerAttack ? enemyPower : playerPower;
  const power =
    attackerPower - defenderPower > 0 ? attackerPower - defenderPower : 0;
  const damage = calculateDamage(power, defender.getAbility().armor);
  defender.health -= damage;
  if (power > 0) {
    player.addTempLog(
      attackerAction.messageGenerator(attacker, defender) +
        `击穿了${defender.name}的防御，造成了<span style="color: red;">` +
        Math.round(damage) +
        `(-${defenderPower})</span>点伤害`,
    );
  } else {
    player.addTempLog(
      defenderAction.messageGenerator(defender, attacker) +
        "," +
        attackerAction.messageGenerator(attacker, defender) +
        "但没有造成伤害",
    );
  }
}

function attackAgainstDodge(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): string {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility());
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility());
  player.addTempLog(
    generatePointString(
      player,
      enemy,
      playerHit,
      enemyHit,
      playerPower,
      enemyPower,
    ),
  );

  const isPlayerAttack =
    playerHit.category === HitCategory.Attack ? true : false;
  const attacker = isPlayerAttack ? player : enemy;
  const dodger = isPlayerAttack ? enemy : player;
  const attackerAction = isPlayerAttack ? playerHit : enemyHit;
  const dodgerAction = isPlayerAttack ? enemyHit : playerHit;
  const attackerPower = calculatePower(
    attackerAction.coeff,
    attacker.getAbility(),
  );
  const dodgerPower = calculatePower(dodgerAction.coeff, dodger.getAbility());

  if (attackerPower > dodgerPower) {
    const damage = calculateDamage(attackerPower, dodger.getAbility().armor);
    dodger.health -= damage;
    player.addTempLog(
      attackerAction.messageGenerator(attacker, dodger) +
        "对" +
        dodger.name +
        '造成了<span style="color: red;">' +
        Math.round(damage) +
        "</span>点伤害",
    );
    return "";
  } else {
    player.addTempLog(
      dodgerAction.messageGenerator(attacker, dodger) +
        "," +
        attacker.name +
        "失衡了",
    );
    return attacker instanceof Player ? "player" : "enemy";
  }
}
