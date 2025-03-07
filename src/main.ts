import { Player } from "./creatures/Player";

function getAppElement(): HTMLElement {
  const el = document.getElementById('app');
  if (!el) {
    throw new Error("无法找到挂载点 #app");
  }
  return el;
}

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
    Math.random() > 0.2 ? renderStartPage() : renderStartPage2();
  });
  document.getElementById('right-btn')?.addEventListener('click', ()=>{
    Math.random() > 0.2 ? renderStartPage() : renderStartPage2();
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
      renderMainMenu(player);
    } else {
      alert("请输入你的名字！");
    }
  });
}

// 渲染主菜单
function renderMainMenu(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>异世界吴田所</h1>
    <p>主菜单</p>
    <button id="battle-btn">战斗</button>
    <button id="status-btn">状态</button>
  `;

  document.getElementById('battle-btn')?.addEventListener('click', () => {renderStatusPage(player)});
  document.getElementById('status-btn')?.addEventListener('click', () => {renderStatusPage(player)});
}

// 渲染状态界面
function renderStatusPage(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h2>状态界面</h2>
    <p>${player.name} 的状态</p>
    <button id="back-btn">返回主菜单</button>
  `;
  document.getElementById('back-btn')?.addEventListener('click', () => {renderMainMenu(player)});
}

// 初始加载时显示主菜单
document.addEventListener('DOMContentLoaded', renderStartPage);
