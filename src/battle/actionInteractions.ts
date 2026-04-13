import { Player } from "../creatures/Player";
import type { Monster } from "../creatures/Monster";
import type { Creature } from "../creatures/Creature";
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

  const originalPlayerHitIcon = getHitIcon(playerHit);
  const originalEnemyHitIcon = getHitIcon(enemyHit);

  const effectivePlayerHit = playerHit.category === HitCategory.Capture
    ? { ...playerHit, category: HitCategory.Attack }
    : playerHit;
  const pCat = effectivePlayerHit.category;
  const eCat = enemyHit.category;

  if (
    pCat === HitCategory.Attack &&
    eCat === HitCategory.Attack
  ) {
    result = attackAgainstAttack(player, enemy, effectivePlayerHit, enemyHit, diceRolls, originalPlayerHitIcon, originalEnemyHitIcon);
  } else if (
    (pCat === HitCategory.Attack && eCat === HitCategory.None) ||
    (pCat === HitCategory.None && eCat === HitCategory.Attack)
  ) {
    result = attackAgainstNone(player, enemy, effectivePlayerHit, enemyHit, diceRolls, originalPlayerHitIcon, originalEnemyHitIcon);
  } else if (
    (pCat === HitCategory.Attack && eCat === HitCategory.Defend) ||
    (pCat === HitCategory.Defend && eCat === HitCategory.Attack)
  ) {
    result = attackAgainstDefend(player, enemy, effectivePlayerHit, enemyHit, diceRolls, originalPlayerHitIcon, originalEnemyHitIcon);
  } else if (
    (pCat === HitCategory.Dodge && eCat === HitCategory.Attack) ||
    (pCat === HitCategory.Attack && eCat === HitCategory.Dodge)
  ) {
    result = attackAgainstDodge(player, enemy, effectivePlayerHit, enemyHit, diceRolls, originalPlayerHitIcon, originalEnemyHitIcon);
  } else {
    diceRolls.push({
      playerName: player.name,
      enemyName: enemy.name,
      playerHitIcon: originalPlayerHitIcon,
      enemyHitIcon: originalEnemyHitIcon,
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
        originalPlayerHitIcon +
        " " +
        enemy.name +
        originalEnemyHitIcon +
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
  const pHits = [...playerAction.hits];
  const eHits = [...enemyAction.hits];
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
  while (pHits[i] || eHits[i]) {
    let playerHit = pHits[i] || NoHit;
    let enemyHit = eHits[i] || NoHit;

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
      pHits.splice(i + 1);
      player.addTempLog(player.name + "的连续hit中断");
    }
    if (enemyHit.continuous && result !== PointComparisonResult.EnemyWin) {
      eHits.splice(i + 1);
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
  playerHitIcon: string,
  enemyHitIcon: string,
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
    playerHitIcon,
    enemyHitIcon,
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
  playerHitIcon: string,
  enemyHitIcon: string,
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
    playerHitIcon,
    enemyHitIcon,
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
  playerHitIcon: string,
  enemyHitIcon: string,
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
    playerHitIcon,
    enemyHitIcon,
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
  playerHitIcon: string,
  enemyHitIcon: string,
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
    playerHitIcon,
    enemyHitIcon,
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

// ==================== 宠物战斗 ====================

function petResolvePair(
  pet: Creature,
  enemy: Creature,
  petHit: Hit,
  enemyHit: Hit,
  damageMultiplier: number,
  diceRolls: DiceRollData[],
): PointComparisonResult {
  const pIcon = getHitIcon(petHit);
  const eIcon = getHitIcon(enemyHit);

  let pCat = petHit.category;
  if (pCat === HitCategory.Capture) pCat = HitCategory.Attack;

  const bothAttack = pCat === HitCategory.Attack && enemyHit.category === HitCategory.Attack;
  const atkVsNone =
    (pCat === HitCategory.Attack && enemyHit.category === HitCategory.None) ||
    (pCat === HitCategory.None && enemyHit.category === HitCategory.Attack);
  const atkVsDef =
    (pCat === HitCategory.Attack && enemyHit.category === HitCategory.Defend) ||
    (pCat === HitCategory.Defend && enemyHit.category === HitCategory.Attack);
  const atkVsDodge =
    (pCat === HitCategory.Attack && enemyHit.category === HitCategory.Dodge) ||
    (pCat === HitCategory.Dodge && enemyHit.category === HitCategory.Attack);

  if (!bothAttack && !atkVsNone && !atkVsDef && !atkVsDodge) {
    diceRolls.push({
      playerName: pet.name, enemyName: enemy.name,
      playerHitIcon: pIcon, enemyHitIcon: eIcon,
      playerPower: -1, enemyPower: -1,
      result: PointComparisonResult.Draw, isNothing: true,
      resultMessage: "无事发生", damage: 0, damageTarget: "none",
      playerHpAfter: 0, enemyHpAfter: 0,
    });
    return PointComparisonResult.Draw;
  }

  const pPower = calculatePower(petHit.coeff, pet.getAbility(), pet.getActionCoeff(pCat));
  const ePower = calculatePower(enemyHit.coeff, enemy.getAbility(), enemy.getActionCoeff(enemyHit.category));

  let result = PointComparisonResult.Draw;
  let msg = "";
  let dmg = 0;
  let dmgTarget: "player" | "enemy" | "none" = "none";

  if (bothAttack) {
    if (pPower >= ePower) {
      result = PointComparisonResult.PlayerWin;
      dmg = calculateDamage(pPower, enemy.getAbility().armor, pet.getAbility().piercing) * damageMultiplier;
      enemy.loseHp(dmg);
      msg = `${pet.name}攻击了${enemy.name}`;
      dmgTarget = "enemy";
    } else {
      result = PointComparisonResult.EnemyWin;
      dmg = calculateDamage(ePower, pet.getAbility().armor, enemy.getAbility().piercing);
      pet.loseHp(dmg);
      msg = `${enemy.name}攻击了${pet.name}`;
      dmgTarget = "player";
    }
  } else if (atkVsNone) {
    const petIsAttacker = pCat === HitCategory.Attack;
    const atkr = petIsAttacker ? pet : enemy;
    const tgt = petIsAttacker ? enemy : pet;
    const power = petIsAttacker ? pPower : ePower;
    let rawDmg = calculateDamage(power, tgt.getAbility().armor, atkr.getAbility().piercing);
    if (petIsAttacker) rawDmg *= damageMultiplier;
    tgt.loseHp(rawDmg);
    result = petIsAttacker ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;
    msg = `${atkr.name}攻击了${tgt.name}`;
    dmg = rawDmg;
    dmgTarget = petIsAttacker ? "enemy" : "player";
  } else if (atkVsDef) {
    const petIsAttacker = pCat === HitCategory.Attack;
    const atkPow = petIsAttacker ? pPower : ePower;
    const defPow = petIsAttacker ? ePower : pPower;
    const atkr = petIsAttacker ? pet : enemy;
    const defr = petIsAttacker ? enemy : pet;
    const eff = atkPow - defPow > 0 ? atkPow - defPow : 0;
    if (eff > 0) {
      let rawDmg = calculateDamage(eff, defr.getAbility().armor, atkr.getAbility().piercing);
      if (petIsAttacker) rawDmg *= damageMultiplier;
      defr.loseHp(rawDmg);
      result = petIsAttacker ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;
      msg = `${atkr.name}击穿了${defr.name}的防御`;
      dmg = rawDmg;
      dmgTarget = petIsAttacker ? "enemy" : "player";
    } else {
      result = petIsAttacker ? PointComparisonResult.EnemyWin : PointComparisonResult.PlayerWin;
      msg = `${defr.name}挡住了${atkr.name}的攻击`;
    }
  } else if (atkVsDodge) {
    const petIsAttacker = pCat === HitCategory.Attack;
    const atkPow = petIsAttacker ? pPower : ePower;
    const dodgePow = petIsAttacker ? ePower : pPower;
    const atkr = petIsAttacker ? pet : enemy;
    const dodger = petIsAttacker ? enemy : pet;
    if (atkPow > dodgePow) {
      let rawDmg = calculateDamage(atkPow, dodger.getAbility().armor, atkr.getAbility().piercing);
      if (petIsAttacker) rawDmg *= damageMultiplier;
      dodger.loseHp(rawDmg);
      result = petIsAttacker ? PointComparisonResult.PlayerWin : PointComparisonResult.EnemyWin;
      msg = `${atkr.name}命中了${dodger.name}`;
      dmg = rawDmg;
      dmgTarget = petIsAttacker ? "enemy" : "player";
    } else {
      result = petIsAttacker ? PointComparisonResult.EnemyWin : PointComparisonResult.PlayerWin;
      msg = `${dodger.name}闪避了${atkr.name}的攻击`;
    }
  }

  diceRolls.push({
    playerName: pet.name, enemyName: enemy.name,
    playerHitIcon: pIcon, enemyHitIcon: eIcon,
    playerPower: Math.round(pPower), enemyPower: Math.round(ePower),
    result, isNothing: false, resultMessage: msg,
    damage: Math.round(dmg), damageTarget: dmgTarget,
    playerHpAfter: 0, enemyHpAfter: 0,
  });
  return result;
}

export function handlePetAction(
  pet: Creature,
  enemy: Creature,
  petAction: Action,
  enemyAction: Action,
  damageMultiplier: number,
): DiceRollData[] {
  const diceRolls: DiceRollData[] = [];
  const pHits = [...petAction.hits];
  const eHits = [...enemyAction.hits];
  let i = 0;
  while (pHits[i] || eHits[i]) {
    const petHit = pHits[i] || NoHit;
    const enemyHit = eHits[i] || NoHit;
    const result = petResolvePair(pet, enemy, petHit, enemyHit, damageMultiplier, diceRolls);

    if (diceRolls.length > 0) {
      const last = diceRolls[diceRolls.length - 1];
      last.playerHpAfter = Math.ceil(pet.health);
      last.enemyHpAfter = Math.ceil(enemy.health);
    }

    if (petHit.continuous && result !== PointComparisonResult.PlayerWin) {
      pHits.splice(i + 1);
    }
    if (enemyHit.continuous && result !== PointComparisonResult.EnemyWin) {
      eHits.splice(i + 1);
    }
    i++;
  }
  return diceRolls;
}
