import { Monster } from "../creatures/Monster";
import { observeEnemyAction, handleAction, statusCheck } from "./battle";
import { renderMainMenu } from "../main";
import { loadPlayer, saveGame } from "../save";
import { getAppElement } from "../tools";
import { Player } from "../creatures/Player";
import { Action } from "../actions/Action";

// 渲染战斗开始界面
function renderBattleStartPage(enemy: Monster): void {
  const appElement = getAppElement();

  const player = loadPlayer();
  const enemyAction = enemy.getRandomAction();
  const enemyActionObservation = observeEnemyAction(player, enemy, enemyAction);
  const action1 = player.getRandomAction();
  const action2 = player.getRandomAction();

  appElement.innerHTML = `
    <h2>战斗开始！</h2>
    <p>${enemy.name} Lv.${enemy.level}</p>
    <p“${enemy.description}”</p>
    <p>${enemyActionObservation}</p>
    <p>HP: ${Math.ceil(enemy.health)}</p>
    <p>-----------------</p>
    <p>${player.name}</p>
    <p>HP: ${Math.ceil(player.health)}</p>
    <div class="row">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn">
          <div class="card-body">
            <h5 class="card-title">${action1.name}</h5>
            <p class="card-text">${action1.description}</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn">
          <div class="card-body">
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

import { getItemInstance } from "../items/tools";

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
    <h2>战斗</h2>
    <p>${enemy.name}</p>
    <p“${enemy.description}”</p>
    <p>${enemyActionObservation}</p>
    <p>HP: ${Math.ceil(enemy.health)}</p>
    <p>-----------------</p>
    <p>${player.name}</p>
    <p>HP: ${Math.ceil(player.health)}</p>
    <div class="row">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn">
          <div class="card-body">
            <h5 class="card-title">${action1.name}</h5>
            <p class="card-text">${action1.description}</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn">
          <div class="card-body">
            <h5 class="card-title">${action2.name}</h5>
            <p class="card-text">${action2.description}</p>
          </div>
        </div>
      </div>
    </div>
    <p> 记录 </p>
    <div id="log">
      ${player.getLastNLog(3)}
    </div>
  `;

  document.getElementById('action1-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action1, enemyAction)});
  document.getElementById('action2-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action2, enemyAction)});
}

import { Item } from "../items/items";

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
		player.addLog(player.name + "拼死逃了出来，拖着残破的身躯，回到了城镇");
	}

  saveGame(player);
  appElement.innerHTML = `
    <h2>战斗结束</h2>
    <p>${player.name} ${result ? "胜利" : "失败"}</p>
    <p>记录</p>
    <div id="log">
      ${player.getLastNLog(3)}
    </div>
    <button class="btn btn-primary" id="main-menu-btn">返回主菜单</button>
  `;
  document.getElementById('main-menu-btn')?.addEventListener('click', () => {renderMainMenu()});
}

import { creatureConfigs } from "../creatures/CreatureType";

export function testBattle(): void {
  let enemyType = Object.keys(creatureConfigs)[Math.floor(Math.random() * Object.keys(creatureConfigs).length)];
	if (enemyType === "player") {
		enemyType = "wolf";
	}
	const enemyLevel = Math.floor(Math.random() * 10) + 1;
	const enemyIndividualStrength = Math.random() * 2;
  const enemy = new Monster(creatureConfigs[enemyType].typeName, enemyType, enemyLevel, enemyIndividualStrength);
  renderBattleStartPage(enemy);
}
