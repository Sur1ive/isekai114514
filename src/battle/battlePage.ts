import { Monster } from "../creatures/Monster";
import { observeEnemyAction, handleAction, statusCheck } from "./battle";
import { renderMainMenu } from "../main";
import { saveGame } from "../save";
import { getAppElement } from "../tools";
import { Player } from "../creatures/Player";
import { Action } from "../actions/Action";
import type { Item } from "../items/Item";


// 渲染战斗开始界面
function renderBattleStartPage(player: Player, enemy: Monster): void {
  const appElement = getAppElement();

  const enemyAction = enemy.getRandomAction();
  const enemyActionObservation = observeEnemyAction(player, enemy, enemyAction);
  const action1 = player.getRandomAction();
  const action2 = player.getRandomAction();
  console.log(enemy.getRandomAction(), player.getRandomAction(), enemy, player);

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
            <p class="card-text">${action1.description}</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${action2.name}</h5>
            <p class="card-text">${action2.description}</p>
          </div>
        </div>
      </div>
    </div>

`;

  document.getElementById('action1-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action1, enemyAction)});
  document.getElementById('action2-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action2, enemyAction)});
}

import { getItemInstance } from "../items/itemUtils";

// 渲染战斗界面
function renderBattlePage(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action): void {
  const appElement = getAppElement();

  handleAction(player, enemy, playerAction, enemyAction);
  const status = statusCheck(player, enemy);
  if (status === "die") {
    renderBattleEndPage(player, enemy, false);
    return;
  } else if (status === "win") {
    renderBattleEndPage(player, enemy, true);
    return;
  }

  enemyAction = enemy.getRandomAction();
  const enemyActionObservation = observeEnemyAction(player, enemy, enemyAction);
  const action1 = player.getRandomAction();
  const action2 = player.getRandomAction();

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
            <p class="card-text">${action1.description}</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${action2.name}</h5>
            <p class="card-text">${action2.description}</p>
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

  document.getElementById('action1-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action1, enemyAction)});
  document.getElementById('action2-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action2, enemyAction)});
}

// 渲染战斗结算界面
function renderBattleEndPage(player: Player, enemy: Monster, result: boolean) {
	const appElement = getAppElement();
	let dropItemInstance: Item;

	if (result) {
		const dropItem = enemy.randomDropItem();
		dropItemInstance = getItemInstance(dropItem);
		player.addLog(enemy.name + "掉落了<span style='color: gold;'>" + dropItemInstance.name + "</span>");
		player.pack.push(dropItem);
	} else {
		player.health = 1;
		player.addLog(player.name + "拼死从" + enemy.name + "的手中逃了出来，拖着残破的身躯，回到了城镇");
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
          ${result
            ? '<span class="text-success">胜利</span>'
            : '<span class="text-danger">失败</span>'}
        </h4>
        <hr>
        <h5>记录</h5>
        <div id="log" class="border rounded p-3" style="max-height: 250px; overflow-y: auto;">
          ${player.getTempLogs()}
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary" id="main-menu-btn">返回主菜单</button>
      </div>
    </div>
  </div>
`;

	player.clearTempLogs();
	saveGame(player);
  document.getElementById('main-menu-btn')?.addEventListener('click', () => {renderMainMenu(player)});
}

import { creatureConfigs, CreatureType } from "../creatures/creatureConfigs";

export function testBattle(player: Player): void {
  let enemyType = Object.values(CreatureType)[Math.floor(Math.random() * Object.values(CreatureType).length)];
  if (enemyType === CreatureType.Player || enemyType === CreatureType.Player114514) {
		enemyType = CreatureType.Wolf;
	}
	const enemyLevel = Math.floor(Math.random() * 10) + 1;
	const enemyIndividualStrength = Math.random() * 2;
  const enemy = new Monster(creatureConfigs[enemyType].typeName, enemyType, enemyLevel, enemyIndividualStrength);
  renderBattleStartPage(player, enemy);
}
