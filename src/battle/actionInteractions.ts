import { Player } from "../creatures/Player";
import type { Monster } from "../creatures/Monster";
import type { Action, Hit } from "../actions/Action";
import { HitCategory } from "../actions/types";
import { NoHit } from "../actions/actionConfigs";
import { calculateDamage, generatePointString } from "./battle";
import { PointComparisonResult } from "./types";
import type { DiceRollData } from "./types";
import { calculatePower, getHitIcon } from "../actions/actionUtils";
import { StatusCategory } from "../creatures/status/Status";
import { statusConfigs, StatusType } from "../creatures/status/statusConfigs";
import type { StatusEffectMap } from "../creatures/status/Status";

function handleHit(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
  diceRolls: DiceRollData[],
): PointComparisonResult {
  let result = PointComparisonResult.Draw;

  if (playerHit.category === HitCategory.Capture) {
    playerHit.category = HitCategory.Attack;
  }

  if (
    playerHit.category === HitCategory.Attack &&
    enemyHit.category === HitCategory.Attack
  ) {
    result = attackAgainstAttack(player, enemy, playerHit, enemyHit, diceRolls);
  } else if (
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.None) ||
    (playerHit.category === HitCategory.None &&
      enemyHit.category === HitCategory.Attack)
  ) {
    result = attackAgainstNone(player, enemy, playerHit, enemyHit, diceRolls);
  } else if (
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.Defend) ||
    (playerHit.category === HitCategory.Defend &&
      enemyHit.category === HitCategory.Attack)
  ) {
    result = attackAgainstDefend(player, enemy, playerHit, enemyHit, diceRolls);
  } else if (
    (playerHit.category === HitCategory.Dodge &&
      enemyHit.category === HitCategory.Attack) ||
    (playerHit.category === HitCategory.Attack &&
      enemyHit.category === HitCategory.Dodge)
  ) {
    result = attackAgainstDodge(player, enemy, playerHit, enemyHit, diceRolls);
  } else {
    diceRolls.push({
      playerName: player.name,
      enemyName: enemy.name,
      playerHitIcon: getHitIcon(playerHit),
      enemyHitIcon: getHitIcon(enemyHit),
      playerPower: -1,
      enemyPower: -1,
      result: PointComparisonResult.Draw,
      isNothing: true,
      resultMessage: "无事发生",
      damage: 0,
      damageTarget: "none",
      playerHpAfter: 0,
      enemyHpAfter: 0,
    });
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
): DiceRollData[] {
  const diceRolls: DiceRollData[] = [];
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

    const result = handleHit(player, enemy, playerHit, enemyHit, diceRolls);

    // 记录本次 hit 结算后双方 HP（含 extraEffect）
    if (diceRolls.length > 0) {
      const lastRoll = diceRolls[diceRolls.length - 1];
      lastRoll.playerHpAfter = Math.ceil(player.health);
      lastRoll.enemyHpAfter = Math.ceil(enemy.health);
    }

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
  return diceRolls;
}

function attackAgainstAttack (
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
  diceRolls: DiceRollData[],
): PointComparisonResult {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility(), player.getActionCoeff(playerHit.category));
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility(), enemy.getActionCoeff(enemyHit.category));

  player.addTempLog(
    generatePointString(player, enemy, playerHit, enemyHit, playerPower, enemyPower),
  );

  let result: PointComparisonResult;
  let resultMessage: string;
  let damage: number;
  let damageTarget: "player" | "enemy";

  if (playerPower >= enemyPower) {
    result = PointComparisonResult.PlayerWin;
    damage = calculateDamage(playerPower, enemy.getAbility().armor, player.getAbility().piercing);
    enemy.loseHp(damage);
    resultMessage = playerHit.messageGenerator(player, enemy);
    damageTarget = "enemy";
    player.addTempLog(
      resultMessage + '造成了<span style="color: red;">' + Math.round(damage) + "</span>点伤害",
    );
  } else {
    result = PointComparisonResult.EnemyWin;
    damage = calculateDamage(enemyPower, player.getAbility().armor, enemy.getAbility().piercing);
    player.loseHp(damage);
    resultMessage = enemyHit.messageGenerator(enemy, player);
    damageTarget = "player";
    player.addTempLog(
      resultMessage + '造成了<span style="color: red;">' + Math.round(damage) + "</span>点伤害",
    );
  }

  diceRolls.push({
    playerName: player.name,
    enemyName: enemy.name,
    playerHitIcon: getHitIcon(playerHit),
    enemyHitIcon: getHitIcon(enemyHit),
    playerPower: Math.round(playerPower),
    enemyPower: Math.round(enemyPower),
    result,
    isNothing: false,
    resultMessage,
    damage: Math.round(damage),
    damageTarget,
    playerHpAfter: 0,
    enemyHpAfter: 0,
  });

  return result;
}

function attackAgainstNone(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
  diceRolls: DiceRollData[],
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
      player, enemy, playerHit, enemyHit,
      actor.isPlayer ? power : 0,
      actor.isPlayer ? power : 0,
    ),
  );

  const damage = calculateDamage(power, target.getAbility().armor, actor.getAbility().piercing);
  target.loseHp(damage);
  const resultMessage = action.messageGenerator(actor, target);
  player.addTempLog(
    resultMessage + '造成了<span style="color: red;">' + Math.round(damage) + "</span>点伤害",
  );

  const result = actor instanceof Player ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;

  diceRolls.push({
    playerName: player.name,
    enemyName: enemy.name,
    playerHitIcon: getHitIcon(playerHit),
    enemyHitIcon: getHitIcon(enemyHit),
    playerPower: actor instanceof Player ? Math.round(power) : -1,
    enemyPower: actor instanceof Player ? -1 : Math.round(power),
    result,
    isNothing: false,
    resultMessage,
    damage: Math.round(damage),
    damageTarget: actor instanceof Player ? "enemy" : "player",
    playerHpAfter: 0,
    enemyHpAfter: 0,
  });

  return result;
}

function attackAgainstDefend(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
  diceRolls: DiceRollData[],
): PointComparisonResult {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility(), player.getActionCoeff(playerHit.category));
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility(), enemy.getActionCoeff(enemyHit.category));

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

  player.addTempLog(
    generatePointString(player, enemy, playerHit, enemyHit, playerPower, enemyPower),
  );

  const damage = calculateDamage(power, defender.getAbility().armor, attacker.getAbility().piercing);
  defender.loseHp(damage);

  let result: PointComparisonResult;
  let resultMessage: string;
  let dmgTarget: "player" | "enemy" | "none";

  if (power > 0) {
    result = isPlayerAttack ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;
    resultMessage = attackerAction.messageGenerator(attacker, defender) + `击穿了${defender.name}的防御`;
    dmgTarget = defender === player ? "player" : "enemy";
    player.addTempLog(
      attackerAction.messageGenerator(attacker, defender) +
        `击穿了${defender.name}的防御，造成了<span style="color: red;">` +
        Math.round(damage) + `(-${Math.round(defenderPower)})</span>点伤害`,
    );
  } else {
    result = isPlayerAttack ? PointComparisonResult.EnemyWin : PointComparisonResult.PlayerWin;
    resultMessage = defenderAction.messageGenerator(defender, attacker) + "，" +
      attackerAction.messageGenerator(attacker, defender) + "但没有造成伤害";
    dmgTarget = "none";
    player.addTempLog(
      defenderAction.messageGenerator(defender, attacker) + "," +
        attackerAction.messageGenerator(attacker, defender) + "但没有造成伤害",
    );
  }

  diceRolls.push({
    playerName: player.name,
    enemyName: enemy.name,
    playerHitIcon: getHitIcon(playerHit),
    enemyHitIcon: getHitIcon(enemyHit),
    playerPower: Math.round(playerPower),
    enemyPower: Math.round(enemyPower),
    result,
    isNothing: false,
    resultMessage,
    damage: Math.round(damage),
    damageTarget: dmgTarget,
    playerHpAfter: 0,
    enemyHpAfter: 0,
  });

  return result;
}

function attackAgainstDodge(
  player: Player,
  enemy: Monster,
  playerHit: Hit,
  enemyHit: Hit,
  diceRolls: DiceRollData[],
): PointComparisonResult {
  const playerPower = calculatePower(playerHit.coeff, player.getAbility(), player.getActionCoeff(playerHit.category));
  const enemyPower = calculatePower(enemyHit.coeff, enemy.getAbility(), enemy.getActionCoeff(enemyHit.category));

  const isPlayerAttack =
    playerHit.category === HitCategory.Attack ? true : false;
  const attacker = isPlayerAttack ? player : enemy;
  const dodger = isPlayerAttack ? enemy : player;
  const attackerAction = isPlayerAttack ? playerHit : enemyHit;
  const dodgerAction = isPlayerAttack ? enemyHit : playerHit;
  const attackerPower = isPlayerAttack ? playerPower : enemyPower;
  const dodgerPower = isPlayerAttack ? enemyPower : playerPower;

  player.addTempLog(
    generatePointString(player, enemy, playerHit, enemyHit, playerPower, enemyPower),
  );

  let result: PointComparisonResult;
  let resultMessage: string;
  let damage = 0;
  let dmgTarget: "player" | "enemy" | "none";

  if (attackerPower > dodgerPower) {
    result = isPlayerAttack ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;
    damage = calculateDamage(attackerPower, dodger.getAbility().armor, attacker.getAbility().piercing);
    dodger.loseHp(damage);
    resultMessage = attackerAction.messageGenerator(attacker, dodger);
    dmgTarget = dodger === player ? "player" : "enemy";
    player.addTempLog(
      resultMessage + "对" + dodger.name +
        '造成了<span style="color: red;">' + Math.round(damage) + "</span>点伤害",
    );
  } else {
    result = isPlayerAttack ? PointComparisonResult.EnemyWin : PointComparisonResult.PlayerWin;
    attacker.addStatus(StatusType.Unbalance, 1);
    resultMessage = dodgerAction.messageGenerator(dodger, attacker) + "，" + attacker.name + "失衡了";
    dmgTarget = "none";
    player.addTempLog(
      dodgerAction.messageGenerator(dodger, attacker) + "," + attacker.name + "失衡了",
    );
  }

  diceRolls.push({
    playerName: player.name,
    enemyName: enemy.name,
    playerHitIcon: getHitIcon(playerHit),
    enemyHitIcon: getHitIcon(enemyHit),
    playerPower: Math.round(playerPower),
    enemyPower: Math.round(enemyPower),
    result,
    isNothing: false,
    resultMessage,
    damage: Math.round(damage),
    damageTarget: dmgTarget,
    playerHpAfter: 0,
    enemyHpAfter: 0,
  });

  return result;
}
