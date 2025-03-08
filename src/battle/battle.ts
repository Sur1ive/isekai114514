import { Player } from "../creatures/Player";
import { Monster } from "../creatures/Monster";
import { getAppElement } from "../tools";
import { Action, ActionCoeff, ActionType, ActionResult } from "../actions/Action";
import { Ability } from "../creatures/Creature";
import { renderMainMenu } from "../main";
import { loadPlayer, saveGame } from "../save";

function calculatePower(coeff: ActionCoeff, ability: Ability) {
  return (coeff.str * ability.str + coeff.dex * ability.dex
  + coeff.int * ability.int + coeff.con * ability.con
  + coeff.siz * ability.siz + coeff.app * ability.app) * Math.random();
}

function calculateDamage(power: number, armor: number) {
  return power * (25 / (armor + 25)) * Math.random();
}

function attackAgainstAttack(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  const playerPower = calculatePower(playerAction.coeff, player.ability);
  const enemyPower = calculatePower(enemyAction.coeff, enemy.ability);
  player.addLog(player.name + "使用了" + playerAction.name + "掷出了" + Math.round(playerPower) + "，" + enemy.name + "使用了" + enemyAction.name + "掷出了" + Math.round(enemyPower));
  if (playerPower >= enemyPower) {
    const damage = calculateDamage(playerPower, enemy.ability.armor);
    enemy.health -= damage;
    player.addLog(enemyAction.messageGenerator(enemy, player, ActionResult.Fail) + "，" + playerAction.messageGenerator(player, enemy, ActionResult.Success) + "造成了" + Math.round(damage) + "点伤害");
  } else {
    const damage = calculateDamage(enemyPower, player.ability.armor);
    player.health -= damage;
    player.addLog(playerAction.messageGenerator(player, enemy, ActionResult.Fail) + "，" + enemyAction.messageGenerator(enemy, player, ActionResult.Success) + "造成了" + Math.round(damage) + "点伤害");
  }
}

function handleAction(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action) {
  if (playerAction.type === ActionType.Attack && enemyAction.type === ActionType.Attack) {
    attackAgainstAttack(player, enemy, playerAction, enemyAction);
  }
}

function statusCheck(player: Player, enemy: Monster) {
  if (player.health <= 0) {
    player.addLog(player.name + "死了");
    return "die";
  }
  if (enemy.health <= 0) {
    player.addLog(enemy.name + "死了");
    return "win";
  }
  return "continue";
}

function observeEnemyAction(player: Player, enemy: Monster, realAction: Action): string {
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
    <p>${enemy.name}</p>
    <p>${enemyActionObservation}</p>
    <p>HP: ${Math.ceil(enemy.health)}</p>
    <p>-----------------</p>
    <p>${player.name}</p>
    <p>HP: ${Math.ceil(player.health)}</p>
    <button id="action1-btn">${action1.name}</button>
    <button id="action2-btn">${action2.name}</button>
    <p> 记录 </p>
    <div id="log">
      ${player.getLogs()}
    </div>
  `;

  document.getElementById('action1-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action1, enemyAction)});
  document.getElementById('action2-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action2, enemyAction)});
}

// 渲染战斗界面
function renderBattlePage(player: Player, enemy: Monster, playerAction: Action, enemyAction: Action): void {
  const appElement = getAppElement();

  handleAction(player, enemy, playerAction, enemyAction);
  const status = statusCheck(player, enemy);
  if (status === "die") {
    saveGame(player);
    renderMainMenu();
    return;
  } else if (status === "win") {
    player.pack.push(enemy.randomDropItem());
    saveGame(player);
    renderMainMenu();
    return;
  }

  enemyAction = enemy.getRandomAction();
  const enemyActionObservation = observeEnemyAction(player, enemy, enemyAction);
  const action1 = player.getRandomAction();
  const action2 = player.getRandomAction();

  appElement.innerHTML = `
    <h2>战斗</h2>
    <p>${enemy.name}</p>
    <p>${enemyActionObservation}</p>
    <p>HP: ${Math.ceil(enemy.health)}</p>
    <p>-----------------</p>
    <p>${player.name}</p>
    <p>HP: ${Math.ceil(player.health)}</p>
    <button id="action1-btn">${action1.name}</button>
    <button id="action2-btn">${action2.name}</button>
    <p> 记录 </p>
    <div id="log">
      ${player.getLogs()}
    </div>
  `;

  document.getElementById('action1-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action1, enemyAction)});
  document.getElementById('action2-btn')?.addEventListener('click', () => {renderBattlePage(player, enemy, action2, enemyAction)});
}

export function testBattle(): void {
  const enemy = new Monster("一般通过史莱姆", "slime", 1, 1);
  renderBattleStartPage(enemy);
}
