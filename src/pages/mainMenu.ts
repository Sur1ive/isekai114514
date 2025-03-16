import playerImage from "../assets/player.gif";
import { Player } from "../creatures/Player";
import { getAppElement } from "../tools";
import { saveGame } from "../save";
import { CreatureType } from "../creatures/creatureConfigs";
import { testBattle } from "../battle/battle";
import { renderStatusPage } from "./statusPage";

// 渲染主菜单
export function renderMainMenu(player: Player): void {
  const appElement = getAppElement();
  player.isAtHome = true;
  saveGame(player);
  console.log(player);

  appElement.innerHTML = `
    <!-- 顶部区域：显示血条和玩家信息 -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <!-- 血条区域 -->
        <div id="health-display" class="mb-3">
          ${player.getHealthDisplay()}
        </div>
        <!-- 玩家信息区域 -->
        <div class="text-center">
          <h2 class="card-title mb-1">
            <span class="badge bg-${player.type === CreatureType.Player114514 ? "danger" : "primary"} ms-2" style="font-size: 0.75rem; padding: 0.35em 0.5em;">
              ${player.type === CreatureType.Player114514 ? "野兽" : "人类"}
            </span>
            ${player.name}
            <small class="text-muted"> lv ${player.level}</small>
          </h2>
          <!-- 经验条 -->
          <div id="exp-display" class="mt-2" style="max-width: 200px; margin: 0 auto;">
            ${player.getExpDisplay()}
          </div>
        </div>

        <!-- 玩家形象区域 -->
        <div class="text-center mt-3">
          <img src=${playerImage} alt="玩家形象" class="img-fluid" style="max-height: 200px;">
        </div>
      </div>
    </div>

    <!-- 主菜单区域：用 mt-auto 自动向下推 -->
    <div class="mt-auto">
      <div class="row g-3 justify-content-center">
        <div class="col-12 col-md-4">
          <button id="battle-btn" class="btn btn-primary w-100 py-3">
            ${player.type === CreatureType.Player114514 ? "救世啊！" : "战斗"}
          </button>
        </div>
        <div class="col-12 col-md-4">
          <button id="status-btn" class="btn btn-success w-100 py-3">状态</button>
        </div>
        <div class="col-12 col-md-4">
          <button id="restart-btn" class="btn btn-danger w-100 py-3">秽土转生</button>
        </div>
      </div>

      <!-- 查看记录按钮 -->
      <div class="text-center mt-4">
        <button class="btn btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
          查看记录
        </button>
      </div>
    </div>

    <!-- Offcanvas 记录面板 -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">记录</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="关闭"></button>
      </div>
      <div class="offcanvas-body">
        <div style="max-height: 60vh; overflow-y: auto;">
          <p>${player.getLastNLog(100)}</p>
        </div>
      </div>
    </div>

    <!-- 底部区域：占位 -->
    <div class="mt-auto">
    </div>
  `;

  // 绑定按钮事件
  document.getElementById("battle-btn")?.addEventListener("click", () => {
    player.isAtHome = false;
    testBattle(player);
  });
  document.getElementById("status-btn")?.addEventListener("click", () => {
    renderStatusPage(player);
  });
  document.getElementById("restart-btn")?.addEventListener("click", () => {
    if (window.confirm("你确定要 remake 吗？")) {
      localStorage.clear();
      window.location.reload();
    }
  });
}
