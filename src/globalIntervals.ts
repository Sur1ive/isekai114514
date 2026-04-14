import { Player } from "./creatures/Player";
import { saveGame } from "./save";

let recoverInterval = -1;
let saveInterval = -1;
let secondStatusInterval = -1;
let lastRecoverTime = 0;
let visibilityHandler: (() => void) | null = null;

function doRecover(player: Player, onTick?: () => void) {
  if (!player.isAtHome) return;

  const now = Date.now();
  const elapsed = (now - lastRecoverTime) / 1000;
  lastRecoverTime = now;

  if (elapsed <= 0) return;

  player.autoRecoverHpDot(elapsed);
  for (const pet of player.capturedMonster) {
    pet.recoverHp(pet.getMaxHealth() * 0.01 * (elapsed / 600));
    if (pet.isFainted && pet.health >= pet.getMaxHealth() * 0.3) {
      pet.isFainted = false;
    }
  }
  onTick?.();
}

// player指向的对象发生改变（新建，加载或者remake）时，需要调用此函数
export function setIntervals(player: Player, onTick?: () => void) {
  if (recoverInterval !== -1) {
    clearInterval(recoverInterval);
  }
  if (saveInterval !== -1) {
    clearInterval(saveInterval);
  }
  if (secondStatusInterval !== -1) {
    clearInterval(secondStatusInterval);
  }
  if (visibilityHandler) {
    document.removeEventListener("visibilitychange", visibilityHandler);
  }

  lastRecoverTime = Date.now();

  recoverInterval = setInterval(() => {
    doRecover(player, onTick);
  }, 1000);

  saveInterval = setInterval(() => {
    if (player.isAtHome) {
      saveGame(player);
    }
  }, 10000);

  secondStatusInterval = setInterval(() => {
    if (player.isAtHome) {
      player.applySecondStatuses();
      onTick?.();
    }
  }, 1000);

  visibilityHandler = () => {
    if (document.visibilityState === "visible") {
      doRecover(player, onTick);
      if (player.isAtHome) {
        saveGame(player);
      }
    }
  };
  document.addEventListener("visibilitychange", visibilityHandler);
}
