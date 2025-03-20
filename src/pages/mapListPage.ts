import { getAppElement } from "../tools";
import { Player } from "../creatures/Player";
import { testBattle } from "../battle/battle";
import { renderMainMenu } from "./mainMenu";

// 渲染地图列表
export function renderMapListPage(player: Player): void {
  const appElement = getAppElement();

  appElement.innerHTML = `
    <div class="mt-auto">
      <div class="row g-3 justify-content-center">
        <div class="col-12 col-md-4">
          <button id="battle-btn" class="btn btn-primary w-100 py-3">
            森林
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
  document.getElementById("battle-btn")?.addEventListener("click", () => {
    player.isAtHome = false;
    testBattle(player);
  });
  document.getElementById("return-btn")?.addEventListener("click", () => {
    renderMainMenu(player);
  });
}
