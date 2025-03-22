import { Player } from "../creatures/Player";
import { testBattle } from "../battle/battle";
import { renderMainMenu } from "./mainMenu";
import { getAppElement } from "./utils";
import { renderMapPage } from "./mapPage";
import { ruinRegion } from "../maps/ruin";

// 渲染地图列表
export function renderMapListPage(player: Player): void {
  const appElement = getAppElement();

  appElement.innerHTML = `
    <div class="mt-auto">
      <div class="row g-3 justify-content-center">
        <div class="col-12 col-md-4">
          <button id="ruin-btn" class="btn btn-primary w-100 py-3">
            废墟
          </button>
        </div>
        <div class="col-12 col-md-4">
          <button id="battle-test-btn" class="btn btn-primary w-100 py-3">
            战斗测试
          </button>
        </div>
        <div class="col-12 col-md-4">
          <button id="return-btn" class="btn btn-success w-100 py-3">返回主菜单</button>
        </div>
      </div>
    </div>
    <!-- 底部区域：占位 -->
    <div class="mt-auto">
    </div>
		<!-- 底部区域：占位 -->
    <div class="mt-auto">
    </div>
  `;

  // 绑定按钮事件
  document.getElementById("ruin-btn")?.addEventListener("click", () => {
    player.isAtHome = false;
    renderMapPage(player, ruinRegion);
  });
  document.getElementById("battle-test-btn")?.addEventListener("click", () => {
    testBattle(player);
  });
  document.getElementById("return-btn")?.addEventListener("click", () => {
    renderMainMenu(player);
  });
}
