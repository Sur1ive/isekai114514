import { Player } from "../creatures/Player";
import type { Monster } from "../creatures/Monster";
import type { Action, Hit } from "../actions/Action";
import { HitCategory } from "../actions/types";
import { NoHit } from "../actions/actionConfigs";
import { calculateDamage, generatePointString } from "./battle";
import { PointComparisonResult } from "./types";
import { calculatePower, getHitIcon } from "../actions/actionUtils";
import { StatusCategory } from "../creatures/status/Status";
import { statusConfigs, StatusType } from "../creatures/status/statusConfigs";
import type { StatusEffectMap } from "../creatures/status/Status";

function handleHit(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): PointComparisonResult {
  let result = PointComparisonResult.Draw;

  if (playerHit.category === HitCategory.Capture) {
    playerHit.category = HitCategory.Attack;
  }

  if (
    playerHit.category === HitCategory.Attack &&
    enemyHit.category === HitCategory.Attack
  ) {
    result = attackAgainstAttack(player, enemy, playerHit, enemyHit);
  } else if (
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.None) ||
    (playerHit.category === HitCategory.None &&
      enemyHit.category === HitCategory.Attack)
  ) {
    result = attackAgainstNone(player, enemy, playerHit, enemyHit);
  } else if (
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.Defend) ||
    (playerHit.category === HitCategory.Defend &&
      enemyHit.category === HitCategory.Attack)
  ) {
    result = attackAgainstDefend(player, enemy, playerHit, enemyHit);
  } else if (
    (playerHit.category === HitCategory.Dodge &&
      enemyHit.category === HitCategory.Attack) ||
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.Dodge)
  ) {
    result = attackAgainstDodge(player, enemy, playerHit, enemyHit);
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
  if (result === PointComparisonResult.PlayerWin) {
    playerHit.extraEffect?.(player, enemy);
  } else if (result === PointComparisonResult.EnemyWin) {
    enemyHit.extraEffect?.(enemy, player);
  }
  return result;
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
    let playerHit = playerAction.hits[i] || NoHit;
    let enemyHit = enemyAction.hits[i] || NoHit;

    // 按照优先级从小往大处理OnHitStart status
    player.statuses.sort((a, b) => a.priority - b.priority).forEach((status) => {
      if (status.category === StatusCategory.OnHitStart) {
        const effect = statusConfigs[status.type].effect as StatusEffectMap[StatusCategory.OnHitStart];
        playerHit = effect(player, playerHit, status.statusLevel);
      }
    });
    enemy.statuses.sort((a, b) => a.priority - b.priority).forEach((status) => {
      if (status.category === StatusCategory.OnHitStart) {
        const effect = statusConfigs[status.type].effect as StatusEffectMap[StatusCategory.OnHitStart];
        enemyHit = effect(enemy, enemyHit, status.statusLevel);
      }
    });

    // 所有onHitStart状态持续时间-1
    player.updateStatusesOnHitStart();
    enemy.updateStatusesOnHitStart();

    const result = handleHit(player, enemy, playerHit, enemyHit);

    // 连续hit未命中会导致后续hit无法释放
    if (playerHit.continuous && result !== PointComparisonResult.PlayerWin) {
      playerAction.hits.splice(i + 1);
      player.addTempLog(player.name + "的连续hit中断");
    }
    if (enemyHit.continuous && result !== PointComparisonResult.EnemyWin) {
      enemyAction.hits.splice(i + 1);
      player.addTempLog(enemy.name + "的连续hit中断");
    }
    i++;
  }

  // Action结束时，清除所有onHit状态
  player.clearStatusByCategory(StatusCategory.OnHitStart);
  enemy.clearStatusByCategory(StatusCategory.OnHitStart);
}

function attackAgainstAttack (
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): PointComparisonResult {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility(), player.getActionCoeff(playerHit.category));
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility(), enemy.getActionCoeff(enemyHit.category));
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
    const damage = calculateDamage(playerPower, enemy.getAbility().armor, player.getAbility().piercing);
    enemy.loseHp(damage);
    player.addTempLog(
      playerHit.messageGenerator(player, enemy) +
        '造成了<span style="color: red;">' +
        Math.round(damage) +
        "</span>点伤害",
    );
    return PointComparisonResult.PlayerWin;
  } else {
    const damage = calculateDamage(enemyPower, player.getAbility().armor, enemy.getAbility().piercing);
    player.loseHp(damage);
    player.addTempLog(
      enemyHit.messageGenerator(enemy, player) +
        '造成了<span style="color: red;">' +
        Math.round(damage) +
        "</span>点伤害",
    );
    return PointComparisonResult.EnemyWin;
  }
}

function attackAgainstNone(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): PointComparisonResult {
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

  const power = calculatePower(action.coeff, actor.getAbility(), actor.getActionCoeff(action.category));
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
  const damage = calculateDamage(power, target.getAbility().armor, actor.getAbility().piercing);
  target.loseHp(damage);
  player.addTempLog(
    action.messageGenerator(actor, target) +
      '造成了<span style="color: red;">' +
      Math.round(damage) +
      "</span>点伤害",
  );
  return actor instanceof Player ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;
}

function attackAgainstDefend(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): PointComparisonResult {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility(), player.getActionCoeff(playerHit.category));
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility(), enemy.getActionCoeff(enemyHit.category));
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
  const damage = calculateDamage(power, defender.getAbility().armor, attacker.getAbility().piercing);
  defender.loseHp(damage);

  if (power > 0) {
    player.addTempLog(
      attackerAction.messageGenerator(attacker, defender) +
        `击穿了${defender.name}的防御，造成了<span style="color: red;">` +
        Math.round(damage) +
        `(-${defenderPower})</span>点伤害`,
    );
    return isPlayerAttack ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;

  } else {
    player.addTempLog(
      defenderAction.messageGenerator(defender, attacker) +
        "," +
        attackerAction.messageGenerator(attacker, defender) +
        "但没有造成伤害",
    );
    return isPlayerAttack ? PointComparisonResult.EnemyWin : PointComparisonResult.PlayerWin;
  }
}

function attackAgainstDodge(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
): PointComparisonResult {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility(), player.getActionCoeff(playerHit.category));
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility(), enemy.getActionCoeff(enemyHit.category));
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
  const attackerPower = isPlayerAttack ? playerPower : enemyPower;
  const dodgerPower = isPlayerAttack ? enemyPower : playerPower;

  if (attackerPower > dodgerPower) {
    const damage = calculateDamage(attackerPower, dodger.getAbility().armor, attacker.getAbility().piercing);
    dodger.loseHp(damage);
    player.addTempLog(
      attackerAction.messageGenerator(attacker, dodger) +
        "对" +
        dodger.name +
        '造成了<span style="color: red;">' +
        Math.round(damage) +
        "</span>点伤害",
    );
    return isPlayerAttack ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;
  } else {
    attacker.addStatus(StatusType.Unbalance, 1);
    player.addTempLog(
      dodgerAction.messageGenerator(dodger, attacker) +
      "," +
      attacker.name +
      "失衡了",
    );
    return isPlayerAttack ? PointComparisonResult.EnemyWin : PointComparisonResult.PlayerWin;
  }
}
