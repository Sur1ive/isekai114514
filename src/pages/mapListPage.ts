import { Player } from "../creatures/Player";
import { renderMainMenu } from "./mainMenu";
import { getAppElement } from "./utils";
import { getRegionById, Region } from "../maps/Region";

// 渲染地图列表
export function renderMapListPage(player: Player): void {
  const appElement = getAppElement();

  // 添加过滤操作，确保只包含有效的地区对象
  const regionList = player.unlockedRegionIdList
    .map((regionId) => getRegionById(regionId))
    .filter((region): region is Region => !!region); // 过滤掉undefined的结果

  // 如果没有可用区域，显示提示信息并提供返回选项
  if (regionList.length === 0) {
    appElement.innerHTML = `
      <div class="mt-auto">
        <div class="row g-3 justify-content-center">
          <div class="col-12 text-center">
            <p class="text-danger">没有可用的地图区域。</p>
          </div>
          <div class="col-12 col-md-4">
            <button id="return-btn" class="btn btn-success w-100 py-3">返回主菜单</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("return-btn")?.addEventListener("click", () => {
      renderMainMenu(player);
    });

    return;
  }

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
      if (getRegionById(region.id).isOpen) {
        player.goToRegion(region.id);
        renderMainMenu(player);
      } else {
        alert("前面的区域以后再来探索吧？");
      }
    });
  });
  document.getElementById("return-btn")?.addEventListener("click", () => {
    renderMainMenu(player);
  });
}
