import "reflect-metadata";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./styles/custom.scss";
import "./styles/custom.css";
import { Player } from "./creatures/Player";
import { loadPlayer } from "./save";
import { renderStartPage } from "./pages/startPages";
import { renderMainMenu } from "./pages/mainMenu";

// 初始加载时显示主菜单
document.addEventListener("DOMContentLoaded", () => {
  let player: Player;
  try {
    player = loadPlayer();
  } catch (error) {
    console.log(error);
    localStorage.clear();
    renderStartPage();
    return;
  }
  renderMainMenu(player);
});
