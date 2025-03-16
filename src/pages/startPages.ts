import { Player } from "../creatures/Player";
import { getAppElement } from "../tools";
import { renderMainMenu } from "./mainMenu";
import { CreatureType } from "../creatures/creatureConfigs";
import { setIntervals } from "../global";
import { saveGame } from "../save";

// 渲染开始界面
export function renderStartPage(): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>你是谁？</h1>
    <div class="row mb-4">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">普通人</h5>
            <p class="card-text">"野兽先辈是什么？"</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">野兽仙贝</h5>
            <p class="card-text">伟大的古希腊哲学家田所曾这样警醒后人：逸一时，误一世，忆旧已久罢忆灵。(如果一时放纵自己，贪图安逸，就可能误了一生的前程) 现在，你将扮演这位伟大的贤人。好时代，来临罢！</p>
            </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("action1-btn")?.addEventListener("click", () => {
    const player = new Player("吴田所", CreatureType.Player);
    setIntervals(player);
    renderStartPage1(player);
  });

  document.getElementById("action2-btn")?.addEventListener("click", () => {
    const player = new Player("田所*二", CreatureType.Player114514);
    setIntervals(player);
    renderStartPage1(player);
  });
}

export function renderStartPage1(player: Player): void {
  const appElement = getAppElement();

  // 生成 0 到 3 的随机整数，每个方向各 25% 概率
  const randomDir = Math.floor(Math.random() * 4);

  let truckRepresentation = "";
  switch (randomDir) {
    case 0:
      truckRepresentation = "<p>车 →→→ 你</p>";
      break;
    case 1:
      truckRepresentation = "<p>你 ←←← 车</p>";
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
  document.getElementById("left-btn")?.addEventListener("click", () => {
    if (Math.random() > 0.3) {
      renderStartPage1(player);
    } else {
      renderStartPage2(player);
    }
  });
  document.getElementById("right-btn")?.addEventListener("click", () => {
    if (Math.random() > 0.3) {
      renderStartPage1(player);
    } else {
      renderStartPage2(player);
    }
  });
}

// 渲染开始界面2
export function renderStartPage2(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>躲避大卡车</h1>
    <p>躲避失败，你嗝屁了</p>
    <button id="continue-btn">继续</button>
  `;

  document.getElementById("continue-btn")?.addEventListener("click", () => {
    renderStartPage3(player);
  });
}

// 渲染开始界面3
export function renderStartPage3(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>???</h1>
    <p>请输入你的名字</p>
    <input type="text" id="name-input" placeholder="${player.name}">
    <button id="continue-btn">继续</button>
  `;

  document.getElementById("continue-btn")?.addEventListener("click", () => {
    const nameInput = document.getElementById("name-input") as HTMLInputElement;
    const playerName = nameInput.value.trim();
    if (playerName) {
      player.name = playerName;
      renderStartPage4(player);
    } else {
      alert("请输入你的名字！");
    }
  });
}

// 渲染开始界面4
export function renderStartPage4(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>???</h1>
    <p>你睁开了眼睛，发现自己好像身处森林之中</p>
    <p>周围的一切都显得那么陌生，充满了异世界风情</p>
    <p>看着远处地上缓慢蠕动的史莱姆，你总算相信自己穿越了</p>
    <button id="continue-btn">继续</button>
  `;

  document.getElementById("continue-btn")?.addEventListener("click", () => {
    saveGame(player);
    renderMainMenu(player);
  });
}
