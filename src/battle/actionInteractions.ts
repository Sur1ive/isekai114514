import { Player } from "../creatures/Player";
import type { Monster } from "../creatures/Monster";
import type { Action, Hit } from "../actions/Action";
import { HitCategory } from "../actions/types";
import { NoHit } from "../actions/actionConfigs";
import { calculateDamage, generatePointString } from "./battle";
import { getHitIcon } from "../tools";
import { StatusType } from "../creatures/status/statusConfigs";
import { BattleResult } from "../types";
import { calculatePower } from "../actions/actionUtils";

function handleHit(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): BattleResult {
  if (playerHit.category === HitCategory.Capture) {
    playerHit.category = HitCategory.Attack;
  }

  if (
    playerHit.category === HitCategory.Attack &&
    enemyHit.category === HitCategory.Attack
  ) {
    return attackAgainstAttack(player, enemy, playerHit, enemyHit);
  } else if (
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.None) ||
    (playerHit.category === HitCategory.None &&
      enemyHit.category === HitCategory.Attack)
  ) {
    return attackAgainstNone(player, enemy, playerHit, enemyHit);
  } else if (
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.Defend) ||
    (playerHit.category === HitCategory.Defend &&
      enemyHit.category === HitCategory.Attack)
  ) {
    return attackAgainstDefend(player, enemy, playerHit, enemyHit);
  } else if (
    (playerHit.category === HitCategory.Dodge &&
      enemyHit.category === HitCategory.Attack) ||
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.Dodge)
  ) {
    return attackAgainstDodge(player, enemy, playerHit, enemyHit);
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
    return BattleResult.Draw;
  }
}

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

    const result = handleHit(player, enemy, playerHit, enemyHit);

    // 连续hit未命中会导致后续hit无法释放
    if (playerHit.continuous && result !== BattleResult.PlayerWin) {
      playerAction.hits.splice(i + 1);
    }
    if (enemyHit.continuous && result !== BattleResult.EnemyWin) {
      enemyAction.hits.splice(i + 1);
    }
    i++;
  }
}

function attackAgainstAttack (
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): BattleResult {
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
    return BattleResult.PlayerWin;
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
    return BattleResult.EnemyWin;
  }
}

function attackAgainstNone(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): BattleResult {
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
      actor.isPlayer ? power : 0,
      actor.isPlayer ? power : 0,
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
  return actor instanceof Player ? BattleResult.PlayerWin : BattleResult.EnemyWin;
}

function attackAgainstDefend(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): BattleResult {
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
    if (attackerAction.extraEffect) {
      attackerAction.extraEffect(attacker, defender);
    }
    return isPlayerAttack ? BattleResult.PlayerWin : BattleResult.EnemyWin;

  } else {
    player.addTempLog(
      defenderAction.messageGenerator(defender, attacker) +
        "," +
        attackerAction.messageGenerator(attacker, defender) +
        "但没有造成伤害",
    );
    return isPlayerAttack ? BattleResult.EnemyWin : BattleResult.PlayerWin;
  }
}

function attackAgainstDodge(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): BattleResult {
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
    return isPlayerAttack ? BattleResult.PlayerWin : BattleResult.EnemyWin;
  } else {
    attacker.addStatus(StatusType.Unbalance, 1);
    player.addTempLog(
      dodgerAction.messageGenerator(attacker, dodger) +
        "," +
        attacker.name +
        "失衡了",
    );
    return isPlayerAttack ? BattleResult.EnemyWin : BattleResult.PlayerWin;
  }
}
