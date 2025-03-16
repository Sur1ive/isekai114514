import { Player } from "../creatures/Player";
import { getAppElement } from "../tools";
import { renderMainMenu } from "./mainMenu";
import { CreatureType } from "../creatures/creatureConfigs";
import { setIntervals } from "../global";
import { saveGame } from "../save";
import { Monster } from "../creatures/Monster";
import { renderBattlePage } from "./battlePage";

// 渲染开始界面
export function renderStartPage(): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>你是谁？</h1>
    <div class="row mb-4">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title" style="font-weight: bold;">普通人</h5>
            <p class="card-text fst-italic">"我不抽烟，酒仅浅尝辄止。晚上11点睡，保证睡足8小时。睡前喝一杯温牛奶，然后做20分钟的舒缓运动再睡觉，一觉熟睡到天亮，绝不把疲劳和压力留到第二天。医生都说我很正常。"</p>
            <p class="card-text" style="font-weight: bold;">(适合不了解野兽先辈的玩家)</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title" style="font-weight: bold;">野兽仙贝</h5>
            <p class="card-text fst-italic">"伟大的古希腊哲学家，野兽学派的大先辈田所曾这样警醒后人：逸一时，误一世。(如果一时放纵自己，贪图安逸，就可能误了一生的前程) 现在，你将扮演这位伟大的贤人。好时代，来临罢！"</p>
            <p class="card-text" style="font-weight: bold;">(适合拥有野兽之心的玩家)</p>
            </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("action1-btn")?.addEventListener("click", () => {
    const player = new Player("吴田所", CreatureType.Player);
    setIntervals(player);
    renderStartPageNormal1(player);
  });

  document.getElementById("action2-btn")?.addEventListener("click", () => {
    const player = new Player("田所", CreatureType.Player114514);
    setIntervals(player);
    const monster = new Monster("远野", CreatureType.Toono, 1, 1);
    player.isAtHome = false;
    renderBattlePage(
      player,
      monster,
      null,
      null,
      (player: Player, _enemy: Monster, result: boolean) => {
        if (result) {
          renderStartPageBeast1_1(player);
        } else {
          renderStartPageBeast1_2(player);
        }
      },
    );
  });
}

function renderStartPageBeast1_1(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>野兽宅</h1>
    <p>距离击败远野已不知过去了多久，但一切都还历历在目。<p>
    <p>你感到痛心疾首，为什么事情会变成这样，为什么亲密无间的两人会反目成仇。<p>
    <p>你不再沉沦，高呼道：伊已逝，吾亦逝。忆旧已久罢忆灵！(你逝去了，而我的心也逝去了，空留肉体如行尸走肉般存活。我已经缅怀故人多时，罢了罢了，是时候随你而去了！)</p>
		<p>你闭上了眼睛。</p>
    <button id="continue-btn">继续</button>
  `;

  document.getElementById("continue-btn")?.addEventListener("click", () => {
    renderStartPage1(player);
  });
}

function renderStartPageBeast1_2(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>野兽宅</h1>
    <p>你被远野击败了。<p>
    <p>你感到痛心疾首，为什么事情会变成这样，为什么亲密无间的两人会反目成仇。<p>
    <p>你愤怒地将手指向远野，不甘心地嘶吼：你是一个一个一个一个，呐，哼哼，啊啊啊啊啊啊啊！！！<p>
    <p>但是意识逐渐模糊，你最终还是倒下了。<p>
    <button id="continue-btn">继续</button>
  `;

  document.getElementById("continue-btn")?.addEventListener("click", () => {
    player.health = player.maxHealth * 0.8;
    renderStartPage1(player);
  });
}

export function renderStartPageNormal1(player: Player): void {
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
      renderStartPageNormal1(player);
    } else {
      renderStartPageNormal2(player);
    }
  });
  document.getElementById("right-btn")?.addEventListener("click", () => {
    if (Math.random() > 0.3) {
      renderStartPageNormal1(player);
    } else {
      renderStartPageNormal2(player);
    }
  });
}

// 渲染开始界面2
export function renderStartPageNormal2(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>躲避大卡车</h1>
    <p>躲避失败，你嗝屁了</p>
    <button id="continue-btn">继续</button>
  `;

  document.getElementById("continue-btn")?.addEventListener("click", () => {
    renderStartPage1(player);
  });
}

// 渲染开始界面3
export function renderStartPage1(player: Player): void {
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
      renderStartPage2(player);
    } else {
      alert("请输入你的名字！");
    }
  });
}

// 渲染开始界面4
export function renderStartPage2(player: Player): void {
  const appElement = getAppElement();
  appElement.innerHTML = `
    <h1>???</h1>
    <p>你睁开了眼睛，发现自己好像身处一片池沼之中</p>
    <p>周围的一切都显得那么陌生，充满了异世界风情</p>
    <p>看着远处地上缓慢蠕动的史莱姆，你总算相信自己穿越了</p>
    <button id="continue-btn">继续</button>
  `;

  document.getElementById("continue-btn")?.addEventListener("click", () => {
    saveGame(player);
    renderMainMenu(player);
  });
}
