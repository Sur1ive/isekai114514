import { Player } from "../creatures/Player";
import { renderMainMenu } from "./mainMenu";
import { getAppElement } from "./utils";
import { getRegionById } from "../maps/Region";

// 渲染地图列表
export function renderMapListPage(player: Player): void {
  const appElement = getAppElement();

  const regionList = player.unlockedRegionIdList.map((regionId) => {
    return getRegionById(regionId);
  });

  appElement.innerHTML = `
    <div class="mt-auto">
      <div class="row g-3 justify-content-center">
        ${regionList.map((region) => {
          return `
            <div class="col-12 col-md-4">
              <button id="${region.id}-btn" class="btn btn-primary w-100 py-3">
                ${region.name}
              </button>
            </div>
          `;
        }).join("")}
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

  regionList.forEach((region) => {
    document.getElementById(`${region.id}-btn`)?.addEventListener("click", () => {
      player.goToRegion(region.id);
      renderMainMenu(player);
    });
  });
  document.getElementById("return-btn")?.addEventListener("click", () => {
    renderMainMenu(player);
  });
}
