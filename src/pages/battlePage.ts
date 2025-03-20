import { Monster } from "../creatures/Monster";
import { observeEnemyAction } from "../battle/battle";
import { handleAction } from "../battle/actionInteractions";
import { saveGame } from "../save";
import { getAppElement } from "./utils";
import { Player } from "../creatures/Player";
import { Action } from "../actions/Action";
import { getHitsDescription } from "../actions/actionUtils";
import { StatusCategory, StatusEffectMap } from "../creatures/status/Status";
import { statusConfigs } from "../creatures/status/statusConfigs";
import { Rarity } from "../types";

// 渲染战斗界面
export function renderBattlePage(
  player: Player,
  enemy: Monster,
  lastPlayerAction: Action | null,
  lastEnemyAction: Action | null,
  endHandler: (player: Player, enemy: Monster, result: boolean) => void,
): void {
  const appElement = getAppElement();

  // 本回合准备阶段
  let enemyAction = enemy.getRandomAction();
  const enemyActionObservation = observeEnemyAction(player, enemy, enemyAction);
  let action1 = player.getRandomAction();
  let action2 = player.getRandomAction();

  // 按照优先级从小往大处理OnTurnStart status
  player.statuses.sort((a, b) => a.priority - b.priority).forEach((status) => {
    if (status.category === StatusCategory.OnTurnStart) {
      const effect = statusConfigs[status.type].effect as StatusEffectMap[StatusCategory.OnTurnStart];
      const actions = effect(player, action1, action2);
      action1 = actions.action1;
      action2 = actions.action2;
    }
  });
  enemy.statuses.sort((a, b) => a.priority - b.priority).forEach((status) => {
    if (status.category === StatusCategory.OnTurnStart) {
      const effect = statusConfigs[status.type].effect as StatusEffectMap[StatusCategory.OnTurnStart];
      const actions = effect(enemy, enemyAction!, enemyAction!);
      enemyAction = actions.action1;
    }
  });

  // 上回合结算
  if (lastPlayerAction && lastEnemyAction) {
    player.addTempLog(
      "--------------------------回合-----------------------------",
    );
    handleAction(player, enemy, lastPlayerAction, lastEnemyAction);
  }

  if (player.health <= 0) {
    player.addLog(player.name + "撑不住了");
    // 战斗结束时，清除所有非永久状态
    player.clearStatus();
    renderBattleEndPage(player, enemy, false, endHandler);
    return;
  }
  if (enemy.health < 1) {
    player.addLog(player.name + "击败了" + enemy.name);
    // 战斗结束时，清除所有非永久状态
    player.clearStatus();
    renderBattleEndPage(player, enemy, true, endHandler);
    return;
  }
  player.updateStatusesOnTurnEnd();
  enemy.updateStatusesOnTurnEnd();
  saveGame(player);

  appElement.innerHTML = `
  <div class="container mt-4">
    <h2 class="text-center mb-3">战斗</h2>

    <!-- 敌人信息 -->
    <div class="card mb-3">
      <div class="card-header bg-danger text-white">
        <h4 class="mb-0">${enemy.name}</h4>
      </div>
      <div class="card-body">
        <p class="card-text fst-italic">"${enemy.description}"</p>
        <p class="card-text">${enemyActionObservation}</p>
        <p class="card-text">HP: <strong>${Math.ceil(enemy.health)}</strong></p>
      </div>
    </div>

    <!-- 分割线 -->
    <hr>

    <!-- 玩家信息 -->
    <div class="card mb-4">
      <div class="card-header bg-success text-white">
        <h4 class="mb-0">${player.name}</h4>
      </div>
      <div class="card-body">
        <p class="card-text">HP: <strong>${Math.ceil(player.health)}</strong></p>
      </div>
    </div>

    <!-- 动作选择 -->
    <div class="row mb-4">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${action1.name}</h5>
            <p class="card-text fst-italic">"${action1.description}"</p>
            <p class="card-text">${getHitsDescription(player, action1)}</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${action2.name}</h5>
            <p class="card-text fst-italic">"${action2.description}"</p>
            <p class="card-text">${getHitsDescription(player, action2)}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗记录 -->
    <div class="card">
      <div class="card-header">
        记录
      </div>
      <div class="card-body" id="log" style="max-height: 200px; overflow-y: auto;">
        ${player.getTempLogs()}
      </div>
    </div>
  </div>
`;

  document.getElementById("action1-btn")?.addEventListener("click", () => {
    renderBattlePage(player, enemy, action1, enemyAction, endHandler);
  });
  document.getElementById("action2-btn")?.addEventListener("click", () => {
    renderBattlePage(player, enemy, action2, enemyAction, endHandler);
  });
}

// 渲染战斗结算界面
function renderBattleEndPage(
  player: Player,
  enemy: Monster,
  result: boolean,
  endHandler: (player: Player, enemy: Monster, result: boolean) => void,
) {
  const appElement = getAppElement();
  let levelUp = false;
  let dropItem = null;
  if (result) {
    dropItem = enemy.randomDropItem();
    player.exp += Math.floor(enemy.giveExp);
    levelUp = player.checkLevelUp();
    player.exp = Math.floor(player.exp);
    player.addLog(
      enemy.name +
        "掉落了<span style='color: gold;'>" +
        (dropItem?.name ?? "无") +
        "</span>",
    );
    if (dropItem) {
      player.pack.push(dropItem);
    }
  } else {
    player.health = 1;
    player.addLog(
      player.name +
        "拼死从" +
        enemy.name +
        "的手中逃了出来，拖着残破的身躯，回到了城镇",
    );
  }

  appElement.innerHTML = `
  <div class="container mt-4">
    <div class="card text-center shadow">
      <div class="card-header bg-dark text-white">
        <h2 class="mb-0">战斗结束</h2>
      </div>
      <div class="card-body">
        <h4 class="card-title">
          ${player.name}
          ${
            result
              ? '<span class="text-success">胜利</span>'
              : '<span class="text-danger">失败</span>'
          }
          <p>lv: ${player.level}${levelUp ? "🔺" : ""} exp: ${player.exp}/${player.getNextLevelExp()}</p>
          ${result ? `<p>获得经验: <span class="text-info">${Math.floor(enemy.giveExp)}</span>  ${dropItem ? `获得物品: <span class="text-${Rarity[dropItem.rarity]}">${dropItem.name}</span>` : ""}</p>` : ""}
        </h4>
        <hr>
        <h5>记录</h5>
        <div id="log" class="border rounded p-3" style="max-height: 250px; overflow-y: auto;">
          ${player.getTempLogs()}
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary" id="continue-btn">继续</button>
      </div>
    </div>
  </div>
`;

  player.clearTempLogs();
  saveGame(player);
  document.getElementById("continue-btn")?.addEventListener("click", () => {
    endHandler(player, enemy, result);
  });
}
