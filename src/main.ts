import "reflect-metadata";
import { Player } from "./creatures/Player";
import { getAppElement } from "./tools";
import { testBattle } from "./battle/battlePage";
import { loadPlayer, saveGame } from "./save";
import { Consumable } from "./items/consumables";
import { getItemInstance } from "./items/tools";
import { Item } from "./items/items";

// 渲染开始界面
function renderStartPage(): void {
  const appElement = getAppElement();

// 生成 0 到 3 的随机整数，每个方向各 25% 概率
const randomDir = Math.floor(Math.random() * 4);

let truckRepresentation = '';
switch (randomDir) {
  case 0:
    truckRepresentation = '<p>车 →→→ 你</p>';
    break;
  case 1:
    truckRepresentation = '<p>你 ←←← 车</p>';
    break;
  case 2:
    truckRepresentation = `
      <p style="text-align: center;">  车</p>
      <p style="text-align: center;">  ↓</p>
      <p style="text-align: center;">  你</p>`;
    break;
  case 3:
    truckRepresentation = `
      <p style="text-align: center;">  你</p>
      <p style="text-align: center;">  ↑</p>
      <p style="text-align: center;">  车</p>`;
    break;
}

appElement.innerHTML = `
  <h1>躲避大卡车</h1>
  <p>一辆卡车正在向你快速驶来，请选择躲避方向</p>
  ${truckRepresentation}
  <button id="left-btn">向左躲避</button>
  <button id="right-btn">向右躲避</button>
`;

  // 给按钮添加点击事件，切换到对应的界面
  document.getElementById('left-btn')?.addEventListener('click', ()=>{
    Math.random() > 0.3 ? renderStartPage() : renderStartPage2();
  });
  document.getElementById('right-btn')?.addEventListener('click', ()=>{
    Math.random() > 0.3 ? renderStartPage() : renderStartPage2();
  });
}

// 渲染开始界面2
function renderStartPage2(): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>躲避大卡车</h1>
    <p>躲避失败，你嗝屁了</p>
    <button id="continue-btn">继续</button>
  `;

  document.getElementById('continue-btn')?.addEventListener('click', renderStartPage3);
}

// 渲染开始界面3
function renderStartPage3(): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>???</h1>
    <p>请输入你的名字</p>
    <input type="text" id="name-input" placeholder="请输入你的名字">
    <button id="continue-btn">继续</button>
  `;

  document.getElementById('continue-btn')?.addEventListener('click', () => {
    const nameInput = document.getElementById('name-input') as HTMLInputElement;
    const playerName = nameInput.value.trim();
    if (playerName) {
      const player = new Player(playerName);
      saveGame(player);
      renderMainMenu();
    } else {
      alert("请输入你的名字！");
    }
  });
}

// 渲染主菜单
export function renderMainMenu(): void {
  const appElement = getAppElement();
  const player = loadPlayer();
  player.backToTown();
  console.log(player);

  appElement.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <h2>${player.name} lv ${player.level}</h2>
      <div id="health-display" class="fs-4 mb-3">hp: </div>
    </div>
  </div>
  <div class="container mt-4">
    <h2 class="text-center mb-4">主菜单</h2>
    <div class="row g-3 justify-content-center">
      <div class="col-12 col-md-4">
        <button id="battle-btn" class="btn btn-primary w-100 py-3">战斗</button>
      </div>
      <div class="col-12 col-md-4">
        <button id="status-btn" class="btn btn-success w-100 py-3">状态</button>
      </div>
      <div class="col-12 col-md-4">
        <button id="restart-btn" class="btn btn-danger w-100 py-3">秽土转生</button>
      </div>
    </div>
    <div class="text-center mt-4">
      <button class="btn btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
        查看记录
      </button>
    </div>
  </div>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasRightLabel">记录</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div style="max-height: 60vh; overflow-y: auto;">
        <p>${player.getLastNLog(20)}</p>
      </div>
    </div>
  </div>
`;

  document.getElementById('battle-btn')?.addEventListener('click', () => {player.startAdventure(); testBattle()});
  document.getElementById('status-btn')?.addEventListener('click', () => {renderStatusPage(player)});
  document.getElementById('restart-btn')?.addEventListener('click', () => {
    if (window.confirm("你确定要remake吗?")) {
      localStorage.removeItem("playerData");
      renderStartPage();
    }
  });
}

// 渲染状态界面
function renderStatusPage(player: Player): void {
  const appElement = getAppElement();

  const packInstance : Item[] = player.pack.map(item => getItemInstance(item));

  appElement.innerHTML = `
  <div class="container mt-4">
    <h2 class="text-center mb-4">状态</h2>

    <!-- 宠物区域 -->
    <div class="row mb-4">
      <div class="col">
        <h4>${player.name} 的宠物</h4>
        <div id="pet" class="border rounded p-3 bg-light">
          ${
            player.capturedMonster.length > 0
              ? player.capturedMonster.map(monster => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-bold">${monster.name}</span>
                  <span class="text-muted">Lv. ${monster.level}</span>
                </div>
              `).join('')
              : '<p class="text-muted">暂无宠物</p>'
          }
        </div>
      </div>
    </div>

    <!-- 背包区域 -->
    <div class="row mb-4">
      <div class="col">
        <h4>${player.name} 的背包</h4>
        <div id="pack" class="d-flex flex-wrap gap-2">
          ${
            packInstance.length > 0
              ? packInstance.map(item => {
                  const btnClass = (item.identifier.type.category === "consumable") ? "btn-success" : "btn-secondary";
                  return `<button id="use-btn${item.identifier.id}" class="btn ${btnClass}">${item.name}</button>`;
                }).join('')
              : '<p class="text-muted">背包为空</p>'
          }
        </div>
      </div>
    </div>

    <!-- 返回主菜单按钮 -->
    <div class="text-center">
      <button id="back-btn" class="btn btn-primary">返回主菜单</button>
    </div>
  </div>
`;

  document.getElementById('back-btn')?.addEventListener('click', () => {renderMainMenu()});
  // 使用消耗品
  for (const item of packInstance) {
    if (item instanceof Consumable) {
      document.getElementById(`use-btn${item.identifier.id}`)?.addEventListener('click', () => {
        item.useItem(player);
        player.addLog(player.name + "使用了" + item.name);
        saveGame(player);
        renderStatusPage(player);
      });
    }
  }
}

// 初始加载时显示主菜单
document.addEventListener('DOMContentLoaded', () => {
  let player: Player;
  try {
    player = loadPlayer();
  } catch (error) {
    localStorage.removeItem("playerData");
    renderStartPage();
    return;
  }
  player.backToTown();
  saveGame(player);
  renderMainMenu();
});
