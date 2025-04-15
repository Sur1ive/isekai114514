import "reflect-metadata";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./styles/custom.scss";
import "./styles/custom.css";
import { loadPlayer } from "./save";
import { renderStartPage } from "./pages/startPages";
import { renderMainMenu } from "./pages/mainMenu";
import { renderMapPage } from "./pages/mapPage";
import { CreatureType } from "./creatures/creatureConfigs";
import { initializeAllMapData } from "./maps/Region";

initializeAllMapData();

// 初始加载时显示主菜单
document.addEventListener("DOMContentLoaded", () => {
  const player = loadPlayer();
  if (!player) {
    localStorage.clear();
    renderStartPage();
    return;
  }
  if (player.currentMapData.currentNodeId) {
    const titleElement = document.getElementById("game-title") as HTMLSpanElement;
    if (player.type === CreatureType.Player) {
      titleElement.textContent = "异世界" + player.name;
    }
    renderMapPage(player);
  } else {
    renderMainMenu(player);
  }
});
